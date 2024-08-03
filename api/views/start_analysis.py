import json
from django.core.management import call_command
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import Analysis, Project, AnalysisType, MLModel, DataFile, AnalysisParameter
from api.views import AnalysisSerializer

@api_view(['POST'])
def start_analysis(request):
    analysis_data = request.data.get('analysis')
    project_data = request.data.get('project')

    if not analysis_data or not project_data:
        return Response({'error': 'Both analysis and project data are required'}, status=400)

    try:
        project = Project.objects.get(id=project_data['id'])
        user = User.objects.get(id=analysis_data['user_id'])
        analysis_type = AnalysisType.objects.get(id=analysis_data['analysis_type_id'])
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    except AnalysisType.DoesNotExist:
        return Response({'error': 'Analysis type not found'}, status=404)

    # Prepare the data for the serializer
    serializer_data = {
        'project': project.id,
        'user': user.id,
        'analysis_type': analysis_type.id,
        'gsea_library': analysis_data.get('gsea_library_id'),
        'ml_model': analysis_data.get('ml_model_id'),
        'status': 'Not Started',
        'parameter_values': analysis_data.get('parameter_values', {})
    }

    # Create a new Analysis instance
    analysis_serializer = AnalysisSerializer(data=serializer_data)
    if analysis_serializer.is_valid():
        analysis = analysis_serializer.save()
    else:
        return Response(analysis_serializer.errors, status=400)

    # Convert parameter IDs to names
    parameter_names = {}
    for param_id, value in serializer_data['parameter_values'].items():
        try:
            param = AnalysisParameter.objects.get(id=param_id)
            parameter_names[param.name] = value
        except AnalysisParameter.DoesNotExist:
            return Response({'error': f'Invalid parameter ID: {param_id}'}, status=400)

    if analysis_type.id in [1, 2]:  # DESeq2 or DESeq2+GSEA
        csv_datafile = project.datafiles.filter(file_type='text/csv').first()
        if not csv_datafile:
            return Response({'error': 'No CSV datafile found in the project'}, status=400)

        command_name = 'run_deseq2_analysis' if analysis_type.id == 1 else 'run_deseq2gsea_analysis'
        call_command(command_name, 
                     str(analysis.id), 
                     csv_datafile.file_path, 
                     json.dumps(parameter_names),
                     stdout=None, 
                     stderr=None)

    elif analysis_type.id == 3:  # Protein Prediction
        fasta_files = project.datafiles.filter(file_type='fasta')
        if not fasta_files:
            return Response({'error': 'No FASTA datafiles found in the project'}, status=400)

        if not serializer_data['ml_model']:
            return Response({'error': 'ML model ID is required for protein structure prediction'}, status=400)

        try:
            ml_model = MLModel.objects.get(id=serializer_data['ml_model'])
        except MLModel.DoesNotExist:
            return Response({'error': 'ML model not found'}, status=404)

        call_command('run_protein_prediction',
                     str(analysis.id),
                     str(ml_model.id),
                     json.dumps(parameter_names),
                     *[file.file_path for file in fasta_files],
                     stdout=None,
                     stderr=None)

    else:
        return Response({'error': 'Invalid analysis type'}, status=400)

    return Response({'message': 'Analysis started', 'analysis_id': analysis.id}, status=202)