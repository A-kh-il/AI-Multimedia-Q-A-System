from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")

db = client["ai_multimedia_qa"]

collection = db["files"]