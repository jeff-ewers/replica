from django.db import models
from api.models import AnalysisType

class AnalysisParameter(models.Model):
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    data_type = models.CharField(max_length=50)
    default_value = models.CharField(max_length=255)
    description = models.TextField()