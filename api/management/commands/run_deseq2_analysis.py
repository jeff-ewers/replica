# myapp/management/commands/run_deseq2_analysis.py

from django.core.management.base import BaseCommand
from api.models import Analysis, Result
import pandas as pd
import scanpy as sc
import numpy as np
from pydeseq2.dds import DeseqDataSet
from pydeseq2.ds import DeseqStats
from sanbomics.tools import id_map
import json
import os
import json
import traceback
import multiprocessing

if __name__ == '__main__':
    multiprocessing.set_start_method('spawn')
os.environ['OBJC_DISABLE_INITIALIZE_FORK_SAFETY'] = 'YES'


class Command(BaseCommand):
    help = 'Runs DESeq2 analysis for a given project and analysis'

    def add_arguments(self, parser):
        parser.add_argument('analysis_id', type=int)
        parser.add_argument('datafile_path', type=str)
        parser.add_argument('parameter_values', type=str)

    def handle(self, *args, **options):
        analysis_id = options['analysis_id']
        datafile_path = options['datafile_path']
        parameter_values = json.loads(options['parameter_values'])
        directory, filename_with_ext = os.path.split(datafile_path)
        filename, _ = os.path.splitext(filename_with_ext)  
        # Create the new directory name by appending 'results' to the datafile name
        new_dir_name = f"{filename}_results"
        base_dir = directory
        new_dir_path = os.path.join(base_dir, new_dir_name)
        OUTPUT_PATH = new_dir_path
        os.makedirs(OUTPUT_PATH, exist_ok=True) 

        analysis = Analysis.objects.get(id=analysis_id)

        baseMean_cutoff = float(parameter_values['baseMean_cutoff'])
        padj_cutoff = float(parameter_values['padj_cutoff'])
        log2_fold_change = float(parameter_values['log2_fold-change'])

        # Update analysis status
        analysis.status = 'Running'
        analysis.save()

        try:
            def expand_geneid(geneid):
                return f"ENSG{int(geneid):011d}"


            # Load data
            counts = pd.read_csv(datafile_path)
            counts = counts.set_index('GeneID')
            counts = counts[counts.sum(axis=1) > 0]
            # expand ENSEMBL gene IDs
            counts.index = counts.index.map(expand_geneid)
            counts = counts.T

            def get_condition(sample_name):
                if sample_name.startswith('Ctr'):
                    return 'C'
                elif sample_name.startswith('RS'):
                    return 'RS'
                else:   
                    return 'Other'            

            sample_info = [(sample, get_condition(sample)) for sample in counts.index]

            # create metadata df
            metadata = pd.DataFrame(sample_info, columns=['Sample', 'Condition'])
            metadata = metadata.set_index('Sample')

            # Run DESeq2
            dds = DeseqDataSet(counts=counts, metadata=metadata, design_factors="Condition", n_cpus=1)
            dds.deseq2()
            stat_res = DeseqStats(dds, contrast=('Condition', 'RS', 'C'))
            stat_res.summary()
            stat_res.results_df.to_csv(os.path.join(OUTPUT_PATH, "results.csv"))
            res = stat_res.results_df

            # Map gene symbols
            mapper = id_map(species='human')
            res['Symbol'] = res.index.map(mapper.mapper)
            res.insert(0, 'Symbol', res.pop('Symbol'))

            # Filter results
            res = res[res.baseMean >= baseMean_cutoff]
            sigs = res[(res.padj < padj_cutoff) & 
                       (abs(res.log2FoldChange) > log2_fold_change)]
            

            class NpEncoder(json.JSONEncoder):
                def default(self, obj):
                    if isinstance(obj, np.integer):
                        return int(obj)
                    if isinstance(obj, np.floating):
                        return float(obj)
                    if isinstance(obj, np.ndarray):
                        return obj.tolist()
                    if pd.isna(obj):
                        return None
                    return super(NpEncoder, self).default(obj)

            sigs_dict = sigs.reset_index().to_dict(orient='records')
            sigs_json = json.dumps(sigs_dict, cls=NpEncoder)

            # # PCA - plot principal components analysis
            # sc.tl.pca(dds)
            # fig, ax = plt.subplots()
            # sc.pl.pca(dds, color='Condition', size=200, ax=ax)
            
            # # Convert plot to base64 string
            # buffer = io.BytesIO()
            # plt.savefig(buffer, format='png')
            # buffer.seek(0)
            # pca_plot = base64.b64encode(buffer.getvalue()).decode()
            # plt.close()

            print("Number of genes with symbols:", res['Symbol'].notna().sum())
            print("Sample of mapped genes:")
            print(res[['Symbol']].head())

        
            directory, filename = os.path.split(datafile_path)

            # Split the filename into name and extension
            name, ext = os.path.splitext(filename)

            # Append 'result' before the extension
            new_filename = f"{name}result{ext}"

            # Join directory and new filename
            output_file_path = os.path.join(directory, new_filename)
            # Save results
            Result.objects.create(
                analysis=analysis,
                analysis_type=analysis.analysis_type,
                output_file_path=output_file_path,
                result=sigs_json
            )

            analysis.status = 'Completed'
            analysis.save()

        except Exception as e:
            analysis.status = 'Failed'
            analysis.save()
            error_message = f"Error running analysis: {str(e)}\n\n{traceback.format_exc()}"
            self.stderr.write(self.style.ERROR(error_message))

        self.stdout.write(self.style.SUCCESS('Analysis completed'))