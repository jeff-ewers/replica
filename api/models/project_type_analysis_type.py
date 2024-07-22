from django.db import models
from api.models import ProjectType, AnalysisType

class ProjectTypeAnalysisType(models.Model):
    project_type = models.ForeignKey(ProjectType, on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)