from rest_framework import viewsets, serializers
from api.models import MLModel

class MLModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = MLModel
        fields = ['id', 'name', 'version', 'analysis_type', 'file_path', 'description']

class MLModelViewSet(viewsets.ModelViewSet):
    queryset = MLModel.objects.all()
    serializer_class = MLModelSerializer