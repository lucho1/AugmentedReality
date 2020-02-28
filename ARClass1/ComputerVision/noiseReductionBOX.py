#Modules
import cv2
import numpy as np
font = cv2.QT_FONT_NORMAL

def boxFilter(img, KernelSize):
    ksize = KernelSize #Kernel definition
    krad = int(ksize/2) # kernel radius
    krn = np.ones((ksize, ksize))
    krn = krn/krn.sum() # normalize kernel
    
    fil = np.zeros(img.shape)
    return fil

# ---------------------------------------------------------------
#Load image
path = "images/lena_noise.jpg"
img = cv2.imread(path, cv2.IMREAD_UNCHANGED)

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