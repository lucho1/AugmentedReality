# ---------------------------------------------------------------
#Modules
import cv2
import numpy as np
default_font = cv2.QT_FONT_NORMAL

# ---------------------------------------------------------------
#Inner Variables
match = False

# ---------------------------------------------------------------
#Inputs
#input_imgPath = input("Introduce Path for Input Image: ")           #ex_img/img1.png
#target_imgPath = input("Introduce Path for Target Image: ")         #ex_img/t1-img1.png
#detection_threshold = input("Introduce Detection Threshold: ")      #0.1

input_imgPath = "ex_img/img1.png"
target_imgPath = "ex_img/t1-img1.png"
detection_threshold = 0.1

msg1 = "Input Image Introduced: {0}".format(input_imgPath)
msg2 = "Target Image Introduced: {0}".format(target_imgPath)
msg3 = "Threshold Introduced: {0}".format(detection_threshold)
print(msg1)
print(msg2)
print(msg3)

# ---------------------------------------------------------------
#Functions



# ---------------------------------------------------------------
#Load Images
input_img = cv2.imread(input_imgPath, cv2.IMREAD_COLOR)
target_img = cv2.imread(target_imgPath, cv2.IMREAD_COLOR)

#Setup Stuff for Text Window
result_img = np.zeros((40, 320, 4), np.uint8)   #Black Image

result_msg = "TARGET NOT FOUND"                 #Text Mesage
result_text_color = (0, 0, 255)                 #Text Color

if match:                                       #Changing Text if match found
    result_msg = "TARGET FOUND"
    result_text_color = (0, 255, 0)

cv2.putText(result_img, result_msg, (5, 30), default_font, 1, result_text_color, 1)     #Put text into image

# ---------------------------------------------------------------
#Display Images
winName = 'Input Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, input_img)

winName = 'Target Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, target_img)

winName = 'Matching Map Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)

winName = 'Result Mesage'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, result_img)

# ---------------------------------------------------------------
#Keep the Screen Showing
cv2.waitKey(0)