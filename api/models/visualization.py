from django.db import models
from api.models import Result

class Visualization(models.Model):
    result = models.ForeignKey(Result, on_delete=models.CASCADE)
    image_path = models.CharField(max_length=255)
    symbol = models.CharField(max_length=50, null=True, blank=True)
    input_file_path = models.CharField(max_length=255, null=True, blank=True)