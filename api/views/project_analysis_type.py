from rest_framework import viewsets, serializers
from api.models import ProjectAnalysisType

class ProjectAnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectAnalysisType
        fields = ['id', 'project', 'analysis_type']

class ProjectAnalysisTypeViewSet(viewsets.ModelViewSet):
    queryset = ProjectAnalysisType.objects.all()
    serializer_class = ProjectAnalysisTypeSerializer