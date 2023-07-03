from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
#request response handler
from PIL import Image
import base64
import io
import torch
import json
from django.http import JsonResponse
from io import BytesIO
from app.format_image_module.SwinSR_Model.swin2sr_net import ImageResolutionUpScaler

HTTP_200_OK = 200

def index(request):
    return render(request, 'index.html')

def super_resolution(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        base64_image = data['image']
        #image = Image.open(base64_image)
        
        lResult = "failure"
        # loading model for image super resolution
        model_pth = "app/format_image_module/SwinSR_Model/models/Swin2SR_RealworldSR_X4_64_BSRGAN_PSNR.pth"
        upScaler = ImageResolutionUpScaler(model_pth)  # Model path
        base64_data = upScaler.imageSuperResolution(base64_image)  # image path

        output_rgb = base64_data[:, :, [2, 1, 0]]
        output_pil = Image.fromarray(output_rgb)
        

        output_bytes = BytesIO()
        output_pil.save(output_bytes, format='JPEG')
        # Convert the ndarray image data to base64
        encoded_image = base64.b64encode(output_bytes.getvalue()).decode('utf-8')

        #cv2.imwrite(outputImgPath + outputFileName + ".png", new_res)

        lResult = "success"
        # Return success response
        return JsonResponse({"image": encoded_image, "result":lResult}, status=HTTP_200_OK)

