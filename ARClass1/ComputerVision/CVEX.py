# ---------------------------------------------------------------
#Modules
import cv2
import numpy as np
default_font = cv2.QT_FONT_NORMAL

# ---------------------------------------------------------------
#Inputs
input_imgPath = input("Introduce Path for Input Image: ")
target_imgPath = input("Introduce Path for Target Image: ")
detection_threshold = input("Introduce Detection Threshold: ")

print(input_imgPath)
print(target_imgPath)
print(detection_threshold)

# ---------------------------------------------------------------
#Functions

# ---------------------------------------------------------------
#Load Images
img = cv2.imread(path, cv2.IMREAD_COLOR)
img2 = cv2.imread(path, cv2.IMREAD_COLOR)
img3 = cv2.imread(path2, cv2.IMREAD_COLOR)

