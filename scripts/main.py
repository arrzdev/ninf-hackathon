from db import mongo
import cv2

from parking.detector import ParkingLot
from beach.crawler import Beach


def run_parking_loop(parking_collection):
  #pool of active parking lots
  process_pool = []

  #not connecting for some reason
  parking_lots = parking_collection.find()
  for parking_lot in parking_lots:
    process_pool.append(ParkingLot(parking_lot))

  #keep processing frames for all parking lots
  while True:
    for plot in process_pool:
      process_res = plot.process_frame()
      if not process_res:
        print("Parking Lot feed failed!")

      #otherwise
      frame, updated = process_res
      if updated:
        new_state = plot.get_state()
        print(f"updated: {new_state}")
        parking_collection.update_one(
          {"_id": plot.get_id()},{
              "$set": new_state
            }
        )

      cv2.imshow("frame", frame)
      if cv2.waitKey(1) & 0xFF == ord('q'):
        break



def main():
  client = mongo.get_client()
  db = client.parking
  parking_collection = db.parking_lots

  run_parking_loop(parking_collection)
  

if __name__ == "__main__":
  main()
