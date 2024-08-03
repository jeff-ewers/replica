from rest_framework import viewsets, serializers
from api.models import Analysis, AnalysisType, AnalysisParameterValue, Result


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'analysis_type', 'output_file_path', 'created_at', 'result']

class AnalysisTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisType
        fields = ['id', 'name', 'description']

class AnalysisParameterValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnalysisParameterValue
        fields = ['id', 'analysis_parameter', 'value']

class AnalysisSerializer(serializers.ModelSerializer):
    results = ResultSerializer(many=True, read_only=True)
    parameter_values = serializers.DictField(write_only=True, required=False)

    class Meta:
        model = Analysis
        fields = ['id', 'user', 'project', 'analysis_type', 'gsea_library', 'status', 'created_at', 'updated_at', 'results', 'parameter_values']
        read_only_fields = ['id', 'created_at', 'updated_at', 'results']

    def create(self, validated_data):
        parameter_values = validated_data.pop('parameter_values', {})
        analysis = super().create(validated_data)

        for param_id, value in parameter_values.items():
            AnalysisParameterValue.objects.create(
                analysis=analysis,
                analysis_parameter_id=int(param_id),
                value=float(value)
            )

        return analysis

class AnalysisViewSet(viewsets.ModelViewSet):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer


    def get_queryset(self):
        return Analysis.objects.select_related('analysis_type')
    
