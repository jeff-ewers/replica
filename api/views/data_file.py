from rest_framework import viewsets, serializers
from api.models import DataFile

class DataFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = DataFile
        fields = ['id', 'project', 'user', 'file_name', 'file_path', 'file_type', 'upload_date', 'condition']

class DataFileViewSet(viewsets.ModelViewSet):
    queryset = DataFile.objects.all()
    serializer_class = DataFileSerializer