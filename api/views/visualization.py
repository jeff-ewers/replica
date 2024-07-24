from rest_framework import viewsets, serializers
from api.models import Visualization

class VisualizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visualization
        fields = ['id', 'result', 'image_path', 'pdb_file_path']

class VisualizationViewSet(viewsets.ModelViewSet):
    queryset = Visualization.objects.all()
    serializer_class = VisualizationSerializer