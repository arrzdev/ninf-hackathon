import cv2
import pickle
import numpy as np
import time
#get current working directory

class ParkingLot:
  def __init__(self, location):
    self.location = location;
    self.parking_id = location["location_id"]
    self.stream = cv2.VideoCapture(f"sources/{self.parking_id}.mp4")

    #load parking slots
    with open(f"blueprints/{self.parking_id}", "rb") as f:
      self.parking_slots = pickle.load(f)

    #set the parking slot size
    #TODO: different sizes for different parking lots
    self.width, self.height = self.location["parking_meta"]["width"], self.location["parking_meta"]["height"]

    #set the current parking status
    self.parking_lot_state = {
      "current_capacity": len(self.parking_slots),
      "max_capacity": len(self.parking_slots),
    }

  def process_frame(self):
    #read the current frame this would ideally come from a stream feed
    success, img = self.stream.read()
    # #save img
    # cv2.imwrite(f"blueprints/help_{self.parking_id}.jpg", img)
    if not success:
      self.stream.set(cv2.CAP_PROP_POS_FRAMES, 0)
      success, img = self.stream.read()

    #get number of frames
    total_frames = self.stream.get(cv2.CAP_PROP_FRAME_COUNT)
    irl_projection = int(round(time.time() * 5)) % total_frames

    self.stream.set(cv2.CAP_PROP_POS_FRAMES, irl_projection)
    
    #post process whole frame
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_blur = cv2.GaussianBlur(img_gray, (3, 3), 1)
    img_threshold = cv2.adaptiveThreshold(img_blur, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 25, 14)
    img_median = cv2.medianBlur(img_threshold, 5)
    kernel = np.ones((3, 3), np.uint8)
    img_dilate = cv2.dilate(img_median, kernel, iterations=1)
    
    #check the empty parking spaces
    state = self.__check_parking_slots__(img, img_dilate)
    updated = True if state != self.parking_lot_state else False
    self.parking_lot_state = state

    return img, updated
  
  def get_state(self):
    return self.parking_lot_state

  def __is_empty_slot__(self, zeros_count):
    return zeros_count < self.location["parking_meta"]["threshold"]

  def __check_parking_slots__(self, img, img_dilate):
    empty_slots = 0

    #go trough all the parking spaces and check if they are free
    for (x, y) in self.parking_slots:

      parking_slot = img_dilate[y:y + self.height, x:x + self.width]
      count = cv2.countNonZero(parking_slot)

      if self.__is_empty_slot__(count):
        empty_slots += 1
        alpha = 0.5  # Set the opacity to 50%
        overlay = img.copy()  # Create a copy of the image to use as the overlay
        cv2.rectangle(overlay, (x, y), (x + self.width, y + self.height), (0, 255, 0), -1)  # Draw the green rectangle on the overlay
        cv2.addWeighted(overlay, alpha, img, 1 - alpha, 0, img)  # Perform alpha blending to combine the two images

      else:
        # Draw the mask of the car in red
        mask = cv2.cvtColor(img_dilate[y:y + self.height, x:x + self.width], cv2.COLOR_GRAY2BGR)
        mask = cv2.bitwise_and(mask, (0, 0, 255))
        img[y:y + self.height, x:x + self.width] = cv2.addWeighted(img[y:y + self.height, x:x + self.width], 1, mask, 0.5, 0)
    
    return {
      "current_capacity": empty_slots,
      "max_capacity": len(self.parking_slots),
    }
