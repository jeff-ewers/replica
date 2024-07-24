from django.db import models
from api.models import Project, AnalysisType

class ProjectAnalysisType(models.Model):
    project = models.ForeignKey(Project, related_name='project_analysis_types', on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)