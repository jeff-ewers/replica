from django.core.management import call_command
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from api.models import Analysis, Project, AnalysisType
from api.views import AnalysisSerializer

@api_view(['POST'])
def start_analysis(request):
    analysis_data = request.data.get('analysis')
    project_data = request.data.get('project')

    if not analysis_data or not project_data:
        return Response({'error': 'Both analysis and project data are required'}, status=400)

    try:
        project = Project.objects.get(id=project_data['id'])
    except Project.DoesNotExist:
        return Response({'error': 'Project not found'}, status=404)

    try:
        user = User.objects.get(id=analysis_data['user_id'])
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    try:
        analysis_type = AnalysisType.objects.get(id=analysis_data['analysis_type_id'])
    except AnalysisType.DoesNotExist:
        return Response({'error': 'Analysis type not found'}, status=404)

    # Prepare the data for the serializer
    serializer_data = {
        'project': project.id,
        'user': user.id,
        'analysis_type': analysis_type.id,
        'gsea_library': analysis_data.get('gsea_library_id'),
        'status': 'Not Started',
        'parameter_values': analysis_data.get('parameters', {})
    }

    # Create a new Analysis instance
    analysis_serializer = AnalysisSerializer(data=serializer_data)
    if analysis_serializer.is_valid():
        analysis = analysis_serializer.save()
    else:
        return Response(analysis_serializer.errors, status=400)

    # Check if the project has a CSV datafile
    csv_datafile = project.datafiles.filter(file_type='text/csv').first()
    if not csv_datafile:
        return Response({'error': 'No CSV datafile found in the project'}, status=400)

    # Start analysis in the background
    call_command('run_deseq2gsea_analysis', str(analysis.id), csv_datafile.file_path, stdout=None, stderr=None)

    return Response({'message': 'Analysis started', 'analysis_id': analysis.id}, status=202)