cd ../face_recognition/opencv-face-recognition
venv\Scripts\activate.bat
python recognize.py --detector face_detection_model --embedding-model openface_nn4.small2.v1.t7 --recognizer output/recognizer.pickle --le output/le.pickle --image images/image.jpg
