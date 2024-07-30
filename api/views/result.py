from rest_framework import viewsets, serializers
from api.models import Result

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'analysis', 'analysis_type', 'output_file_path', 'created_at', 'result']

class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer