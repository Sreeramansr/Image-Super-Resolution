# -*- coding: utf-8 -*-
"""
Created on Thu Jan 26 18:49:54 2023

@author: DEV profield01
"""

from swin2sr_net import ImageResolutionUpScaler
import cv2

model_pth = "app/format_image_module/SwinSR_Model/models/Swin2SR_RealworldSR_X4_64_BSRGAN_PSNR.pth"
image_pth = "E:/Super Resolution Models/Programs/SwinSR_Model/inputs"
save_dir = 'E:/Super Resolution Models/Programs/SwinSR_Model'

upscaler = ImageResolutionUpScaler(model_pth + "/" + "Swin2SR_RealworldSR_X4_64_BSRGAN_PSNR.pth") #Model path

new_res = upscaler.imageSuperResolution(image_pth + "/" + "img1.jpg") #image path

new_res2 = upscaler.imageSuperResolution(image_pth + "/" + "img2.jpg")

#Show image
cv2.imshow("output", new_res2)
cv2.waitKey()

# Save Image
#cv2.imwrite(save_dir + "/" + "Swin2RealSR2.png", new_res2)
