from django.db import models
from api.models import Project, AnalysisType

class ProjectAnalysisType(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)