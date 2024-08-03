# myapp/management/commands/run_deseq2_analysis.py

from django.core.management.base import BaseCommand
from api.models import Analysis, Result
import pandas as pd
import scanpy as sc
import numpy as np
from pydeseq2.dds import DeseqDataSet
from pydeseq2.ds import DeseqStats
import gseapy as gp
from sanbomics.tools import id_map
import matplotlib.pyplot as plt
import io
import base64
import json
import os
import json
import re
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
        new_dir_name = f"{filename}results"
        base_dir = directory
        new_dir_path = os.path.join(base_dir, new_dir_name)
        OUTPUT_PATH = new_dir_path
        os.makedirs(OUTPUT_PATH, exist_ok=True) 
        # pv = options['parameter_values']

        analysis = Analysis.objects.get(id=analysis_id)

        # TODO: fix parsing of parameter values
        # Use the passed parameter values
        baseMean_cutoff = float(parameter_values['baseMean_cutoff'])
        padj_cutoff = float(parameter_values['padj_cutoff'])
        log2_fold_change = float(parameter_values['log2_fold_change'])
        # parameter_values = {pv.analysis_parameter.name: pv.value for pv in analysis.parameter_values.all()}

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

            # # PCA
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

            # GSEA
            ranking = res.reset_index()[['GeneID', 'Symbol', 'stat']].dropna()
            ranking = ranking.sort_values('stat', ascending=False)
            ranking = ranking.drop_duplicates('Symbol')

            print("Ranking columns:", ranking.columns)
            print("Ranking shape:", ranking.shape)
            print("Ranking head:")
            print(ranking.head())
            print("Unique symbols:", ranking['Symbol'].nunique())

            # Prepare ranking for gseapy
            gseapy_ranking = ranking[['Symbol', 'stat']]
            gseapy_ranking.columns = ['gene_name', 'prerank']

            print("GSEAPY Ranking shape:", gseapy_ranking.shape)
            print("GSEAPY Ranking head:")
            print(gseapy_ranking.head())

            gene_sets = gp.get_library('GO_Biological_Process_2021')
            


            pre_res = gp.prerank(rnk=gseapy_ranking, gene_sets=gene_sets, seed=6, permutation_num=100)

            out = []
            for term in list(pre_res.results):
                out.append([term,
                            pre_res.results[term]['fdr'],
                            pre_res.results[term]['es'],
                            pre_res.results[term]['nes']])
            out_df = pd.DataFrame(out, columns=['Term', 'fdr', 'es', 'nes']).sort_values('fdr').reset_index(drop=True)
            directory, filename = os.path.split(datafile_path)

            # Parse filenames
            name, ext = os.path.splitext(filename)
            new_filename = f"{name}result{ext}"
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