from django.db import models
from api.models import Project

class Protein(models.Model):
    project = models.ForeignKey(Project, related_name='proteins', on_delete=models.CASCADE)
    symbol = models.CharField(max_length=50)
    sequence = models.TextField()