from rest_framework import viewsets, serializers
from api.models import AnalysisParameterValue

class AnalysisParameterValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisParameterValue
        fields = ['id', 'analysis', 'analysis_parameter', 'value']

class AnalysisParameterValueViewSet(viewsets.ModelViewSet):
    queryset = AnalysisParameterValue.objects.all()
    serializer_class = AnalysisParameterValueSerializer