from django.db import models
from django.contrib.auth.models import User
from api.models import ProjectType

class Project(models.Model):
    user = models.ForeignKey(User, related_name='projects', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    project_type = models.ForeignKey(ProjectType, related_name='projects', on_delete=models.CASCADE)
    project_path = models.TextField()
    analysis_types = models.ManyToManyField('AnalysisType', through='ProjectAnalysisType', related_name='projects')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)