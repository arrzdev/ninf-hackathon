from decouple import config
from flask import Flask
from flask_cors import CORS
from flask import jsonify
import cv2
import base64

from scripts.parking.detector import ParkingLot
from scripts.beach.crawler import Beach

from db import mongo

MONGO_HOST = config("MONGO_HOST")
if not MONGO_HOST:
  raise ValueError("Missing MONGO_HOST environment variable")

app = Flask(__name__)
CORS(app)

def check_parking(location_id):
  #get parking lot object
  parking_lot = beach_parking_pool.get(location_id, None)
  if parking_lot == None:
    return {
      "error": "No parking lot with that id"
    }
  
  #process
  res = parking_lot.process_frame()
  if not res:
    return {
      "error": "Stream feed failed"
    }
  
  frame, updated = res

   #convert cv2 Image frame to base64
  _, buffer = cv2.imencode('.jpg', frame)
  b64_frame = base64.b64encode(buffer).decode('utf-8')

  new_parking_data = parking_lot.get_state()

  if updated: #update document 
    new_parking_data.update({
      "last_snapshot": b64_frame
    })
    beachs_collection.update_one({"location_id":
     location_id},{
          "$set": new_parking_data
        }
    )

  return new_parking_data

@app.route("/locations")
def all():
  locations = beachs_collection.find({}, {
    "parking_meta": 0,
    "_id": 0
  })

  try:
    updated_locations = []
    for location in locations:
      location.update(check_parking(location["location_id"]))
      location.pop("last_snapshot", None) #remove snapshot from response
      updated_locations.append(location)
  except:
    return {"error": "Server error"}, 500
  
  return jsonify(updated_locations)
  

@app.route("/locations/<location_id>")
def one(location_id):
  location = beachs_collection.find_one({
    "location_id": int(location_id)
  }, {
    "parking_meta": 0,
       "_id": 0
  })

  if not location:
    return {"error": "Location not found"}

  detector_data = check_parking(location["location_id"])

  if "error" in detector_data:
    return detector_data
  
  #get logs
  parking_logs = list(parking_logs_collection.find({
    "location_id": int(location_id)
  }, {
    "_id": 0,
    "location_id": 0
  }))

  

  #update current data
  location.update(detector_data)
  location.update({"hourly": parking_logs})

  return jsonify(location)

  


  #update parking data


@app.route("/beach")
def beach():
  beach = Beach(14)
  return jsonify(beach.get_data())

  

if __name__ == "__main__":
  #get mongo stuff
  client = mongo.get_client(MONGO_HOST)
  
  ##
  locations_db = client.locations
  parking_db = client.parking

  ###
  beachs_collection = locations_db.beachs
  parking_logs_collection = parking_db.logs

  #create a parking lot pool
  beach_parking_pool = {}

  #get all parking lots
  beach_locations = beachs_collection.find()

  #add all parking lots to the pool
  for beach_location in beach_locations:
    beach_parking_pool.update({
      beach_location["location_id"]: ParkingLot(beach_location)
    })

  #init api
  app.run(debug=True)