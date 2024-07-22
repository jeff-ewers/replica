from django.db import models
from django.contrib.auth.models import User
from api.models import Project, AnalysisType, GSEALibrary

class Analysis(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    analysis_type = models.ForeignKey(AnalysisType, on_delete=models.CASCADE)
    gsea_library = models.ForeignKey(GSEALibrary, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)