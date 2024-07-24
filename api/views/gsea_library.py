from rest_framework import viewsets, serializers
from api.models import GSEALibrary

class GSEALibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = GSEALibrary
        fields = ['id', 'name', 'description']

class GSEALibraryViewSet(viewsets.ModelViewSet):
    queryset = GSEALibrary.objects.all()
    serializer_class = GSEALibrarySerializer