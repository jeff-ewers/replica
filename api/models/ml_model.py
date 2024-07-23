from django.db import models
from api.models import AnalysisType

class MLModel(models.Model):
    name = models.CharField(max_length=100)
    version = models.CharField(max_length=50)
    analysis_type = models.ForeignKey(AnalysisType, related_name='models', on_delete=models.CASCADE)
    file_path = models.CharField(max_length=255)
    description = models.TextField()