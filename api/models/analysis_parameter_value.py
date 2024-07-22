from django.db import models
from api.models import AnalysisParameter, Analysis

class AnalysisParameterValue(models.Model):
    analysis = models.ForeignKey(Analysis, on_delete=models.CASCADE)
    analysis_parameter = models.ForeignKey(AnalysisParameter, on_delete=models.CASCADE)
    value = models.CharField(max_length=255)