from django.db import models
from api.models import AnalysisParameter, Analysis

class AnalysisParameterValue(models.Model):
    analysis = models.ForeignKey(Analysis, related_name='parameter_values', on_delete=models.CASCADE)
    analysis_parameter = models.ForeignKey(AnalysisParameter, related_name='parameters', on_delete=models.CASCADE)
    value = models.CharField(max_length=255)