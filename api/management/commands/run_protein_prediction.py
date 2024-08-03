from django.core.management.base import BaseCommand
from api.models import Analysis, MLModel, Result, Visualization
import torch
# import esm
from transformers import AutoTokenizer, AutoModel, pipeline
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import seaborn as sns
import os
import json
import numpy as np
from typing import List, Dict, Any, Tuple


class Command(BaseCommand):
    help = 'Runs protein analysis based on the selected ML model'

    def add_arguments(self, parser):
        parser.add_argument('analysis_id', type=int)
        parser.add_argument('ml_model_id', type=int)
        parser.add_argument('parameter_values', type=str)
        parser.add_argument('fasta_files', nargs='+', type=str)

    def handle(self, *args, **options):
        analysis_id = options['analysis_id']
        ml_model_id = options['ml_model_id']
        parameter_values = json.loads(options['parameter_values'])
        fasta_files = options['fasta_files']

        analysis = Analysis.objects.get(id=analysis_id)
        ml_model = MLModel.objects.get(id=ml_model_id)

        analysis.status = 'Running'
        analysis.save()

        try:
            results = []

            for fasta_file in fasta_files:
                sequences = self.parse_fasta(fasta_file)
                for seq_id, sequence in sequences:
                    if 'esm-2' in ml_model.name.lower():
                        result_data = self.run_esm2_analysis(sequence, ml_model.file_path, parameter_values)
                    elif 'prottrans' in ml_model.name.lower():
                        result_data = self.run_prottrans_analysis(sequence, ml_model.name, parameter_values)
                    else:
                        raise ValueError(f"Unsupported model: {ml_model.name}")

                    result_data['file_name'] = os.path.basename(fasta_file)
                    result_data['sequence_id'] = seq_id
                    results.append(result_data)

            result = Result.objects.create(
                analysis=analysis,
                analysis_type=analysis.analysis_type,
                output_file_path=json.dumps([r.get('visualization_path') for r in results if r.get('visualization_path')]),
                result=json.dumps(results)
            )

            for r in results:
                if r.get('visualization_path'):
                    Visualization.objects.create(
                        result=result,
                        image_path=r['visualization_path'],
                        # pdb_file_path=''  # We don't generate PDB files in this case
                    )

            analysis.status = 'Completed'
            analysis.save()

        except Exception as e:
            analysis.status = 'Failed'
            analysis.save()
            self.stderr.write(self.style.ERROR(f'Error running analysis: {str(e)}'))

        self.stdout.write(self.style.SUCCESS('Analysis completed'))

    def parse_fasta(self, file_path: str) -> List[Tuple[str, str]]:
        sequences = []
        current_seq = []
        current_id = ""

        with open(file_path, 'r') as file:
            for line in file:
                line = line.strip()
                if line.startswith('>'):
                    if current_seq:
                        sequences.append((current_id, ''.join(current_seq)))
                        current_seq = []
                    current_id = line[1:]
                else:
                    current_seq.append(line)

        if current_seq:
            sequences.append((current_id, ''.join(current_seq)))

        return sequences

    def run_esm2_analysis(self, sequence: str, model_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        # TODO: add model flexibility
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)

        inputs = tokenizer(sequence, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)

        # Extract embeddings
        embeddings = outputs.last_hidden_state

        # Simplified contact prediction 
        contacts = torch.matmul(embeddings[0], embeddings[0].transpose(0, 1))
        
        # Simplified secondary structure prediction 
        ss_prediction = torch.argmax(embeddings[0, :, :3], dim=-1)

        # Visualize contact map
        plt.figure(figsize=(10, 10))
        sns.heatmap(contacts.cpu().numpy(), cmap="Blues")
        plt.title("Predicted Contact Map (Simplified)")
        plt.tight_layout()
        contact_map_path = f"../../output/contact_map_{sequence[:10]}.png"
        plt.savefig(contact_map_path)
        plt.close()

        return {
            'contacts': contacts.cpu().numpy().tolist(),
            'secondary_structure': ss_prediction.cpu().numpy().tolist(),
            'visualization_path': contact_map_path
        }

    def run_prottrans_analysis(self, sequence: str, model_name: str, params: Dict[str, Any]) -> Dict[str, Any]:
        #
        # THIS IS JUST A PLACEHOLDER
        #
        # TODO: implement protein function prediction using AmelieSchreiber/esm2_t6_8M_finetuned_cafa5
        #
        #
        tokenizer = AutoTokenizer.from_pretrained(model_name)
        model = AutoModel.from_pretrained(model_name)

        inputs = tokenizer(sequence, return_tensors="pt")
        with torch.no_grad():
            outputs = model(**inputs)

        # get embeddings for the whole sequence
        embeddings = outputs.last_hidden_state.mean(dim=1)


        classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")
        
        # Example labels for protein function
        candidate_labels = ["enzyme", "structural protein", "signaling protein", "transport protein"]
        
        classification = classifier(sequence, candidate_labels)

        # Visualize embeddings
        plt.ioff()
        plt.figure(figsize=(10, 5))
        plt.plot(embeddings[0].cpu().numpy())
        plt.title("Protein Embedding")
        plt.xlabel("Embedding Dimension")
        plt.ylabel("Value")
        plt.tight_layout()
        embedding_plot_path = f"embedding_plot_{sequence[:10]}.png"
        plt.savefig(embedding_plot_path)
        plt.close(plt.gcf()) 

        return {
            'embeddings': embeddings[0].cpu().numpy().tolist(),
            'classification': classification,
            'visualization_path': embedding_plot_path
        }