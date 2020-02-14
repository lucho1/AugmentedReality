# We installed code as a zip for 64 bit in this folder. Then, with a couple
# of CMD console commands, we have installed a virtual python machine in the
# directory. Then, open the directory, here in Code (Open Folder) and click
# down left in the "Python 3.7.4-bit" label and select the directory. 
# Finally, we have installed Pylint.

#Modules
import cv2
import numpy

#Load image
path = "images/rice.jpg"
#img = cv2.imread(path, cv2.IMREAD_COLOR)
#img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
img = cv2.imread(path, cv2.IMREAD_UNCHANGED)

size = (654, 76) #Tuple
img = cv2.resize(img, size) #Image resize

#Display image
cv2.imshow('image', img)

#Keep the screen showing
k = cv2.waitKey(0)
if k == 27: #ESC to exit
    cv2.destroyAllWindows()
elif k == ord('s'): #S key to save & exit
    cv2.imwrite('LastImage.jpg', img)
    cv2.destroyAllWindows()