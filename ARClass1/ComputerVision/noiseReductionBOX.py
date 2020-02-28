#Modules
import cv2
import numpy as np
font = cv2.QT_FONT_NORMAL

def boxFilter(img, KernelSize):
    ksize = KernelSize #Kernel definition
    krad = int(ksize/2) # kernel radius
    krn = np.ones((ksize, ksize))
    krn = krn/krn.sum() # normalize kernel
    
    height, width, depth = img.shape

    # Frame ti avoid out-boundaries access
    frm = np.ones((height + krad * 2, width + krad * 2, depth))
    frm[krad:-krad, krad:-krad] = img

    # Filtered Image
    fil = np.zeros(img.shape)
    for i in range(0, height):
        for j in range(0, width):
            b = (frm[i:i+ksize, j:j+ksize, 0] * krn).sum()
            g = (frm[i:i+ksize, j:j+ksize, 1] * krn).sum()
            r = (frm[i:i+ksize, j:j+ksize, 2] * krn).sum()
            fil[i, j] = (b, g, r)

    return fil

# ---------------------------------------------------------------
#Load image
path = "images/lena_noise.jpg"
img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
img2 = cv2.imread(path, cv2.IMREAD_UNCHANGED)
boxFilter(img, 10)

# ---------------------------------------------------------------
#Display image
winName = 'Img Without Noise'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, boxFilter(img, 21))

winName = 'Img With Noise'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, img2)

# ---------------------------------------------------------------
#Keep the screen showing
k = cv2.waitKey(0)