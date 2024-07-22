from rest_framework import viewsets, serializers
from api.models import ProjectTypeAnalysisType

class ProjectTypeAnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectTypeAnalysisType
        fields = ['id', 'project_type', 'analysis_type']

class ProjectTypeAnalysisTypeViewSet(viewsets.ModelViewSet):
    queryset = ProjectTypeAnalysisType.objects.all()
    serializer_class = ProjectTypeAnalysisTypeSerializer