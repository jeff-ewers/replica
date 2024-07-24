from django.db import models
from api.models import Analysis, AnalysisType

class Result(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)
    output_file_path = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)