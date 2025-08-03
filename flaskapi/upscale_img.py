from PIL import Image
import cv2
import numpy as np

def upscale_image(img: Image.Image):
    img_np = np.array(img)
    img_cv2 = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    upscaled = cv2.resize(img_cv2, (0, 0), fx=8, fy=8, interpolation=cv2.INTER_CUBIC)
    return Image.fromarray(cv2.cvtColor(upscaled, cv2.COLOR_BGR2RGB))
