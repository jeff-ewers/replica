from rest_framework import viewsets, serializers
from api.models import AnalysisType

class AnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description']

class AnalysisTypeViewSet(viewsets.ModelViewSet):
    queryset = AnalysisType.objects.all()
    serializer_class = AnalysisTypeSerializer