from scripts.parking.detector import ParkingLot

from decouple import config
from db import mongo

import cv2

# MONGO_HOST = config("MONGO_HOST")
# if not MONGO_HOST:
#   raise ValueError("Missing MONGO_HOST environment variable")


# client = mongo.get_client(MONGO_HOST)
# db = client.locations
# beachs_collection = db.beachs

locations = [
{
    "name": "Praia da Mata",
    "location": "Praia da Mata, Costa de Caparica, 2825-491",
    "location_id": 14,
    "parking_meta": {
      "width": 106,
      "height": 48,
      "threshold": 950
    },
    "current_capacity": 0,
    "max_capacity": 0
  },
  {
    "name": "Praia da Morena",
    "location": "Praia da Morena, Costa de Caparica, 2825-486",
    "location_id": 15,
    "parking_meta": {
      "width": 15,
      "height": 40,
      "threshold": 6
    },
    "current_capacity": 0,
    "max_capacity": 0
  },
  {
    "name": "Praia do Rei",
    "location": "Praia do Rei, Costa de Caparica, 2820-018",
    "location_id": 16,
    "parking_meta": {
      "width": 15,
      "height": 40, 
      "threshold": 3,
    },
    "current_capacity": 0,
    "max_capacity": 0
  },
]

# beachs_collection.insert_many(locations)
beach = locations[1]
teste = ParkingLot(beach)

while True:
  res = teste.process_frame()

  if not res:
    print("no frame to process")
    t = teste.process_frame()
    res = t
    
  frame, updated = res

  #show frame
  cv2.imshow("frame", frame)
  cv2.waitKey(10)

#