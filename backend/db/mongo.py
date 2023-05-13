from pymongo import MongoClient

def get_client(MONGO_HOST):
  try:
    client = MongoClient(MONGO_HOST)
    return client
  except Exception as e:
    raise e