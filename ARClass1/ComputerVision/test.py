# We installed code as a zip for 64 bit in this folder. Then, with a couple
# of CMD console commands, we have installed a virtual python machine in the
# directory. Then, open the directory, here in Code (Open Folder) and click
# down left in the "Python 3.7.4-bit" label and select the directory. 
# Finally, we have installed Pylint.

#Functions
def PrintImgData(size, shape, dataType, px):
    print(size) # total num of pixels
    print(shape) # img size (X x Y)
    print(dataType)
    print(px)

#Modules
import cv2
import numpy as np
font = cv2.QT_FONT_NORMAL

# ---------------------------------------------------------------
#Load image
path = "images/rice.jpg"
img = cv2.imread(path, cv2.IMREAD_UNCHANGED)

#size = (654, 76) #Tuple
#img = cv2.resize(img, size) #Image resize

#img[100, 100] = [255, 255, 255] #You can modify pixels
#px = img[100, 100] #this accesses image in pixel X, Y
#Better accessing like:
px = img.item(100, 100, 2) #modify value with img.itemset((Px, Py, RGBChannel), value)
PrintImgData(img.size, img.shape, img.dtype, px)

msg1 = "Shape: {0}".format(img.shape)
msg2 = "Pixel Amount: {0}".format(img.size)
msg3 = "Data Type: {0}".format(img.dtype)
cv2.putText(img, msg1, (10, 50), font, 0.5, (0, 0, 0), 1)
cv2.putText(img, msg2, (10, 65), font, 0.5, (0, 0, 0), 1)
cv2.putText(img, msg3, (10, 80), font, 0.5, (0, 0, 0), 1)

# ---------------------------------------------------------------
#Display image
cv2.namedWindow('Img Test', cv2.WINDOW_NORMAL)
cv2.imshow('Img Test', img)

# ---------------------------------------------------------------
#Keep the screen showing
k = cv2.waitKey(0)
if k == 27: #ESC to exit
    cv2.destroyAllWindows()
elif k == ord('s'): #S key to save & exit
    cv2.imwrite('LastImage.jpg', img)
    cv2.destroyAllWindows()