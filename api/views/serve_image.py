from django.http import HttpResponse
from django.conf import settings
from PIL import Image
import os

def serve_image(request, filepath):
    print(settings.BASE_DIR)
    # Construct the full path to the image file
    full_path = os.path.join(settings.BASE_DIR, filepath)
    
    # Check if the file exists
    if not os.path.exists(full_path):
        return HttpResponse("Image not found", status=404)
    
    # Open the image using Pillow
    try:
        with Image.open(full_path) as img:
            response = HttpResponse(content_type=f"image/{img.format.lower()}")
            img.save(response, img.format)
            return response
    except IOError:
        return HttpResponse("Unable to load image", status=500)