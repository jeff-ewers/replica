from rest_framework import viewsets, serializers
from api.models import Analysis

class AnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Analysis
        fields = ['id', 'user', 'project', 'analysis_type', 'gsea_library', 'status', 'created_at', 'updated_at']

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer