from rest_framework import viewsets, serializers
from api.models import Metadata

class MetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metadata
        fields = ['id', 'project', 'key', 'value']

class MetadataViewSet(viewsets.ModelViewSet):
    queryset = Metadata.objects.all()
    serializer_class = MetadataSerializer