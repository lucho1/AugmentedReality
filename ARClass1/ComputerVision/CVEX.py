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
def FilterImage(target_image, main_image):

    #height, width, depth = image.shape
    ret = np.zeros(main_image.shape)
    main_height, main_width, _ = main_image.shape
    target_height, target_width, _ = target_image.shape

    for i in range(0, main_height):
        for j in range(0, main_width):
            for k in range(0, target_height):
                for w in range(0, target_width):
                    if(i < 48 and j < 48 and k < 48 and w < 48 and (j+w) < 48 and (k+i) < 48):
                        ret[i][j] = np.sqrt(target_image[w][k] - main_image[j+w][k+i])

    return ret

# ---------------------------------------------------------------
#Load Images
input_img = cv2.imread(input_imgPath, cv2.IMREAD_COLOR)
target_img = cv2.imread(target_imgPath, cv2.IMREAD_COLOR)

#Create Matching Map Image
matchingmap_img = FilterImage(target_img, input_img)

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
cv2.imshow(winName, matchingmap_img)

winName = 'Result Mesage'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, result_img)

# ---------------------------------------------------------------
#Keep the Screen Showing
cv2.waitKey(0)