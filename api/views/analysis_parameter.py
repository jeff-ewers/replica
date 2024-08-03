from rest_framework import viewsets, serializers
from api.models import AnalysisParameter

class AnalysisParameterSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisParameter
        fields = ['id', 'analysis_type', 'name', 'data_type', 'default_value', 'description']

class AnalysisParameterViewSet(viewsets.ModelViewSet):
    queryset = AnalysisParameter.objects.all()
    serializer_class = AnalysisParameterSerializer

    def get_queryset(self):
        queryset = AnalysisParameter.objects.all()
        analysis_type = self.request.query_params.get('analysis_type', None)
        if analysis_type is not None:
            queryset = queryset.filter(analysis_type__exact=analysis_type)
        return queryset