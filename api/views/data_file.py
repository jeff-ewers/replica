from rest_framework import viewsets, serializers, status
from rest_framework.response import Response
from api.models import DataFile, Condition

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id', 'name', 'description']

class DataFileSerializer(serializers.ModelSerializer):
    # condition = ConditionSerializer(read_only=True)
    condition = serializers.PrimaryKeyRelatedField(queryset=Condition.objects.all())

    class Meta:
        model = DataFile
        fields = ['id', 'project', 'user', 'file_name', 'file_path', 'file_type', 'upload_date', 'condition']

class DataFileViewSet(viewsets.ModelViewSet):
    queryset = DataFile.objects.all()
    serializer_class = DataFileSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        condition_id = self.request.data.get('condition_id') or self.request.data.get('condition')
        if condition_id is None:
            raise serializers.ValidationError("Condition ID is required")
        try:
            condition = Condition.objects.get(id=condition_id)
        except Condition.DoesNotExist:
            raise serializers.ValidationError(f"Condition with id {condition_id} does not exist")
        serializer.save(condition=condition)

    def get_queryset(self):
        return DataFile.objects.select_related('condition')