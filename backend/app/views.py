from flask import request, abort, jsonify, render_template
from app import app
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
import os
import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import spacy

from app.generate import generate_image, generate_keywords, generate_prompt

load_dotenv()
client = openai.OpenAI()


@app.route("/", methods=["GET"])
def index():
    return render_template("game.html")


@app.route("/generate/game", methods=["POST"])
def generate_game():
    keywords = generate_keywords()
    prompt = generate_prompt(keywords)
    image = generate_image(prompt)


@app.route("/similarity", methods=["GET"])
def word_similarity():
    nlp = spacy.load("en_core_web_md")
    word1 = request.args.get("word1")
    word2 = request.args.get("word2")

    word1_embedding = nlp(word1).vector.reshape(1, -1)
    word2_embedding = nlp(word2).vector.reshape(1, -1)

    similarity_score = cosine_similarity(word1_embedding, word2_embedding)[0][0]

    return str(similarity_score)
