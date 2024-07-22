from rest_framework import viewsets, serializers
from api.models import Protein

class ProteinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = ['id', 'project', 'symbol', 'sequence']

class ProteinViewSet(viewsets.ModelViewSet):
    queryset = Protein.objects.all()
    serializer_class = ProteinSerializer