from django.db import models
from api.models import Project

class Condition(models.Model):
    project = models.ForeignKey(Project, related_name='conditions', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField()