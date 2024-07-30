from django.db import models
from api.models import Analysis, AnalysisType

class Result(models.Model):
    analysis = models.ForeignKey(Analysis, related_name='results', on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, related_name='results', on_delete=models.CASCADE)
    output_file_path = models.CharField(max_length=255)
    result = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)