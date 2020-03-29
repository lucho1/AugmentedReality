import cv2

target_imgPath = input("Introduce Path for Target Image: ") #ex_img/img1.png
input_img = cv2.imread(target_imgPath, cv2.IMREAD_COLOR)
winName = 'Input Image'
cv2.namedWindow(winName, cv2.WINDOW_NORMAL)
cv2.imshow(winName, input_img)

cv2.waitKey(0)
cv2.destroyAllWindows()