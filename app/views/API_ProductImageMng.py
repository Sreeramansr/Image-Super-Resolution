import io, os
import json
import ulid
import base64
import cv2
import numpy as np
from PIL import Image
import fitz

from app.format_image_module.SwinSR_Model.swin2sr_net import ImageResolutionUpScaler



class ProductImageUpdateResolution(APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, prd_mng_id):
        # Get the image file from the request
        import time

        lResult = "failure"
        data = json.loads(request.body)
        lPrdImgDir = os.path.join(G_ENV_PIM_PRODUCT_DATA_STRAGE, prd_mng_id)
        if not os.path.exists(lPrdImgDir):
            return
        image_path = os.path.join(lPrdImgDir, prd_mng_id) + "_" + data["name"] + "_" + data["imageId"] + G_PIM_PRODUCT_IMAGE_FILE_EXT
        # Save the high resolution image to the server
        outputImgPath = G_ENV_PIM_PRODUCT_SAVE_SUPER_RESOLUTION_DATA_ADDR
        outputFileName = prd_mng_id + data["imageId"]

        # loading model for image super resolution
        model_pth = "app/format_image_module/SwinSR_Model/models/Swin2SR_RealworldSR_X4_64_BSRGAN_PSNR.pth"
        upScaler = ImageResolutionUpScaler(model_pth)  # Model path
        new_res = upScaler.imageSuperResolution(image_path)  # image path

        cv2.imwrite(outputImgPath + outputFileName + ".png", new_res)

        lResult = "success"
        # Return success response
        return JsonResponse({"result": lResult}, status=HTTP_200_OK)