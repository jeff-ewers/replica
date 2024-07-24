from rest_framework import viewsets, serializers
from api.models import Analysis, AnalysisType

class AnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description']

class AnalysisSerializer(serializers.ModelSerializer):
    type = AnalysisTypeSerializer(read_only=True)
    class Meta:
        model = Analysis
        fields = ['id', 'user', 'project', 'type', 'gsea_library', 'status', 'created_at', 'updated_at']

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer


    def get_queryset(self):
        return Analysis.objects.select_related('analysis_type')