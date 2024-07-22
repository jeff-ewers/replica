from django.db import models
from api.models import Project

class Metadata(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    key = models.CharField(max_length=100)
    value = models.TextField()