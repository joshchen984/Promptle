from flask import request, render_template
from app import app
from dotenv import load_dotenv
import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import spacy
from flask_pymongo import PyMongo
import json
from bson import json_util

from app.generate import generate_image, generate_keywords, generate_prompt

load_dotenv()
client = openai.OpenAI()
mongo = PyMongo(app)


@app.route("/", methods=["GET"])
def index():
    return render_template("game.html")


@app.route("/generate/game", methods=["POST"])
def generate_game():
    keywords = generate_keywords()
    prompt = generate_prompt(keywords)
    image = generate_image(prompt)
    image = {"keywords": keywords.split(","), "prompt": prompt, "image": image}
    mongo.db.images.insert_one(image)
    return json.loads(json_util.dumps(image))


@app.route("/similarity", methods=["GET"])
def word_similarity():
    nlp = spacy.load("en_core_web_md")
    word1 = request.args.get("word1")
    word2 = request.args.get("word2")

    word1_embedding = nlp(word1).vector.reshape(1, -1)
    word2_embedding = nlp(word2).vector.reshape(1, -1)

    similarity_score = cosine_similarity(word1_embedding, word2_embedding)[0][0]

    return str(similarity_score)


@app.route("/images", methods=["GET"])
def get_images():
    res = mongo.db.images.find()
    documents = []
    for doc in res:
        documents.append(doc)
    return json.loads(json_util.dumps(documents))


@app.route("/random-image", methods=["GET"])
def get_random_image():
    # mongo query to get random document
    res = mongo.db.images.aggregate([{"$sample": {"size": 1}}])
    if res:
        # Loop used so returned result isn't an array
        for doc in res:
            return json.loads(json_util.dumps(doc))
    return "No images found", 204
