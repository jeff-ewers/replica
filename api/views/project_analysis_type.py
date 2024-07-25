from rest_framework import viewsets, serializers
from api.models import ProjectAnalysisType
from api.models import AnalysisType

class AnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description']

class ProjectAnalysisTypeSerializer(serializers.ModelSerializer):
    analysis_type = AnalysisTypeSerializer(read_only=True)
    class Meta:
        model = ProjectAnalysisType
        fields = ['id', 'project', 'analysis_type']

class ProjectAnalysisTypeViewSet(viewsets.ModelViewSet):
    queryset = ProjectAnalysisType.objects.all()
    serializer_class = ProjectAnalysisTypeSerializer

    def get_queryset(self):
        queryset = ProjectAnalysisType.objects.all()
        project_id = self.request.query_params.get('project', None)
        if project_id is not None:
            queryset = queryset.filter(project_id__exact=project_id)
        return queryset
