from decouple import config
from pymongo import MongoClient

MONGO_HOST = config("MONGO_HOST")
if not MONGO_HOST:
  raise ValueError("Missing MONGO_HOST environment variable")

def get_client():
  try:
    client = MongoClient(MONGO_HOST)
    return client
  except Exception as e:
    raise e