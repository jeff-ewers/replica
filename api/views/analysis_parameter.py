from rest_framework import viewsets, serializers
from api.models import AnalysisParameter

class AnalysisParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisParameter
        fields = ['id', 'analysis_type', 'name', 'data_type', 'default_value', 'description']

class AnalysisParameterViewSet(viewsets.ModelViewSet):
    queryset = AnalysisParameter.objects.all()
    serializer_class = AnalysisParameterSerializer