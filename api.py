from decouple import config
from flask import Flask
from flask import jsonify
import json
import cv2
import base64

from scripts.parking.detector import ParkingLot
from scripts.beach.crawler import Beach

from db import mongo

MONGO_HOST = config("MONGO_HOST")
if not MONGO_HOST:
  raise ValueError("Missing MONGO_HOST environment variable")

app = Flask(__name__)

@app.route("/parking/<name>")
def parking(name):
  park = parking_collection.find_one({
    "name": name
  })
  
  if not park:
    return {"error": "Parking lot not found"}, 404
  
  #get the park from the pool
  park = parking_lots_pool[park["_id"]]
  res = park.process_frame()

  if not res:
    return {"error": "Parking lot feed failed"}, 500
  
  frame, updated = res

  #save frame
  cv2.imwrite(f"frames/{park.get_id()}.jpg", frame)

  #convert cv2 Image frame to base64
  _, buffer = cv2.imencode('.jpg', frame)
  b64_frame = base64.b64encode(buffer).decode('utf-8')

  current_state = park.get_state()
  
  #add b64 frame
  current_state.update({
    "last_frame": b64_frame
  })

  if updated:
    print("UPDATED DB!")
    parking_collection.update_one(
      {"_id": park.get_id()},{
          "$set": current_state
        }
    )

  return jsonify(current_state)

@app.route("/beach")
def beach():
  beach = Beach(14)
  return jsonify(beach.get_data())

  

if __name__ == "__main__":
  #get mongo stuff
  db = mongo.get_client(MONGO_HOST)
  parking_collection = db.parking.parking_lots

  #create a parking lot pool
  parking_lots_pool = {}

  #get all parking lots
  parking_lots = parking_collection.find()

  #add all parking lots to the pool
  for parking_lot in parking_lots:
    parking_lots_pool.update({
      parking_lot["_id"]: ParkingLot(parking_lot)
    })

  #init api
  app.run(debug=True)