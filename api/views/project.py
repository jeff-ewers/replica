from rest_framework import serializers, viewsets, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
from api.models import (
    Project, ProjectType, ProjectAnalysisType, AnalysisType, Analysis, 
    Result, DataFile, Metadata, Condition, Protein
)

class AnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description']

class ProjectAnalysisTypeSerializer(serializers.ModelSerializer):
    analysis_type = AnalysisTypeSerializer(read_only=True)

    class Meta:
        model = ProjectAnalysisType
        fields = ['id', 'analysis_type']

class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'output_file_path', 'created_at']

class AnalysisSerializer(serializers.ModelSerializer):
    results = ResultSerializer(many=True, read_only=True)

    class Meta:
        model = Analysis
        fields = ['id', 'user', 'analysis_type', 'gsea_library', 'status', 'created_at', 'updated_at', 'results']

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id', 'name', 'description']

class DataFileSerializer(serializers.ModelSerializer):
    condition = ConditionSerializer(read_only=True)

    class Meta:
        model = DataFile
        fields = ['id', 'project', 'user', 'file_name', 'file_path', 'file_type', 'upload_date', 'condition']

class MetadataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Metadata
        fields = ['id', 'key', 'value']

class ConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Condition
        fields = ['id', 'name', 'description']

class ProteinSerializer(serializers.ModelSerializer):
    class Meta:
        model = Protein
        fields = ['id', 'symbol', 'sequence']

class ProjectTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectType
        fields = ['id', 'name', 'description']

class ProjectSerializer(serializers.ModelSerializer):
    project_type = ProjectTypeSerializer(read_only=True)
    project_analysis_types = ProjectAnalysisTypeSerializer(many=True, read_only=True)
    analyses = AnalysisSerializer(many=True, read_only=True)
    datafiles = DataFileSerializer(many=True, read_only=True)
    metadata = MetadataSerializer(many=True, read_only=True)
    conditions = ConditionSerializer(many=True, read_only=True)
    proteins = ProteinSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Project
        fields = ['id', 'user', 'title', 'description', 'project_type', 'project_path', 'created_at', 'updated_at',
                  'project_analysis_types', 'analyses', 'datafiles', 'metadata', 'conditions', 'proteins']
        
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Project.objects.prefetch_related(
            'project_type',
            'project_analysis_types__analysis_type',
            'analyses__results',
            'datafiles',
            'metadata',
            'conditions',
            'proteins'
        )
    
    def create(self, request, *args, **kwargs):
        project_type_id = request.data.get('project_type')
        project_type = ProjectType.objects.get(id=project_type_id)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(project_type=project_type)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        # Assuming you're passing user in the request. Adjust as necessary.
        serializer.save(user=self.request.user)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)