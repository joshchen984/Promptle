from flask import Flask
import os
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import urllib

load_dotenv()


def create_app():
    """Creates configured app"""
    app = Flask(__name__)
    mongo_uri = f"mongodb+srv://{urllib.parse.quote(os.environ.get('MONGO_USERNAME'))}:{urllib.parse.quote(os.environ.get('MONGO_PASSWORD'))}@cluster0.qwottkf.mongodb.net/?retryWrites=true&w=majority"
    app.config["MONGO_URI"] = mongo_uri
    mongo = PyMongo(app)
    return app


app = create_app()
from app import views
