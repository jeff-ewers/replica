from django.db import models
from django.contrib.auth.models import User
from api.models import Project, Condition

class DataFile(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    file_name = models.CharField(max_length=255)
    file_path = models.CharField(max_length=255)
    file_type = models.CharField(max_length=50)
    upload_date = models.DateTimeField(auto_now_add=True)
    condition = models.ForeignKey(Condition, on_delete=models.CASCADE)