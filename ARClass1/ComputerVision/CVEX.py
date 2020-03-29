# ---------------------------------------------------------------
#Modules
import cv2
import numpy as np
default_font = cv2.QT_FONT_NORMAL

# ---------------------------------------------------------------
#Functions
def GenerateMatchingMapImage(target_img_grey, input_img_grey):
    target_height, target_width = target_img_grey.shape
    main_height, main_width = input_img_grey.shape

    #This is like the equivalent to keep the image in boundaries (avoiding target img going out input img)
    w = main_width - target_width + 1
    h = main_height - target_height + 1

    #This would be the Matching Map
    result = np.zeros((h, w))
    for i in range(0, h):
        for j in range(0, w):
            mat = input_img_grey[i:i+target_height, j:j+target_width]
            result[i,j] = np.sum(np.power(target_img_grey - mat, 2))

    return result

def DrawHighlightRectangles(inputIMG, matchingMap_img, min_thresh):
    main_height, main_width, _ = inputIMG.shape
    matchMap_h, matchMap_w = matchingMap_img.shape

    #Like the above function:
    #The equivalent to keep the image in boundaries (avoiding target img going out input img)
    w = main_width - matchMap_w + 1
    h = main_height - matchMap_h + 1

    #inputIMG passed gets highlighted according to the matching map
    for i in range(0, matchMap_h):
        for j in range(0, matchMap_w):
            if matchingMap_img[i, j]/matchingMap_img.max() < min_thresh:
                cv2.rectangle(inputIMG, (j, i), (j + w, i + h), (0, 255, 0), 1) #Creates a rectangle where the matching map points say

    return 0

# ---------------------------------------------------------------
#Inner Variables
match = False

# ---------------------------------------------------------------
#Inputs
#NOTE FOR JESUS: We have tried to do this through inputs but it give
#error of "libpng warning: bKGD: invalid", so we hardcoded it
input_imgPath = str(input("Introduce Path for Input Image: "))          #ex_img/img1.png
target_imgPath = str(input("Introduce Path for Target Image: "))        #ex_img/t1-img1.png
detection_threshold = float(input("Introduce Detection Threshold: "))   #0.1

#input_imgPath = "ex_img/img1.png"
#target_imgPath = "ex_img/t1-img1.png"
#detection_threshold = 0.1

msg1 = "Input Image Introduced: {0}".format(input_imgPath)
msg2 = "Target Image Introduced: {0}".format(target_imgPath)
msg3 = "Threshold Introduced: {0}".format(detection_threshold)
print(msg1)
print(msg2)
print(msg3)

# ---------------------------------------------------------------
#Load Images
input_img = cv2.imread(input_imgPath, cv2.IMREAD_COLOR)
target_img = cv2.imread(target_imgPath, cv2.IMREAD_COLOR)

# ---------------------------------------------------------------
#Create Matching Map Image
target_gray_img = cv2.cvtColor(target_img, cv2.COLOR_BGR2GRAY)
input_gray_img = cv2.cvtColor(input_img, cv2.COLOR_BGR2GRAY)

matchingmap_img = GenerateMatchingMapImage(target_gray_img, input_gray_img)
matchingmap_img /= 255 #Normalize!!!! (Otherwise matchMap img is seen very weird)

#See if there is any detection (according to threshold)
match = matchingmap_img.min()/matchingmap_img.max() < detection_threshold

# ---------------------------------------------------------------
#Setup Text Window
result_img = np.zeros((40, 320, 4), np.uint8)   #Black Image

result_msg = "TARGET NOT FOUND"                 #Text Mesage
result_text_color = (0, 0, 255)                 #Text Color

if match:                                       #Changing Text if match found
    result_msg = "TARGET FOUND"
    result_text_color = (0, 255, 0)
    DrawHighlightRectangles(input_img, matchingmap_img, detection_threshold)

#Put text into image
cv2.putText(result_img, result_msg, (5, 30), default_font, 1, result_text_color, 1)

# ---------------------------------------------------------------
#Display Images
winName = 'Input Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, input_img)

winName = 'Target Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, target_img)

winName = 'Matching Map'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, np.uint8(matchingmap_img))

winName = 'Result Mesage'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, result_img)

# ---------------------------------------------------------------
#Keep the Screen Showing until a key is pressed
cv2.waitKey(0)
cv2.destroyAllWindows()