from rest_framework import viewsets, serializers
from api.models import ProjectAnalysisType, AnalysisType, AnalysisParameter

class AnalysisParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisParameter
        fields = ['id', 'name', 'data_type', 'default_value', 'description']

class AnalysisTypeSerializer(serializers.ModelSerializer):
    parameters = AnalysisParameterSerializer(many=True, read_only=True)

    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description', 'parameters']

class ProjectAnalysisTypeSerializer(serializers.ModelSerializer):
    analysis_type = AnalysisTypeSerializer(read_only=True)

    class Meta:
        model = ProjectAnalysisType
        fields = ['id', 'project', 'analysis_type']

class ProjectAnalysisTypeViewSet(viewsets.ModelViewSet):
    queryset = ProjectAnalysisType.objects.all()
    serializer_class = ProjectAnalysisTypeSerializer

    def get_queryset(self):
        queryset = ProjectAnalysisType.objects.all().select_related('analysis_type').prefetch_related('analysis_type__parameters')
        project_id = self.request.query_params.get('project', None)
        if project_id is not None:
            queryset = queryset.filter(project_id=project_id)
        return queryset