from flask import request, abort, jsonify, render_template
from app import app
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
import os
import openai
from dotenv import load_dotenv

from app.generate import generate_image, generate_keywords, generate_prompt


@app.route("/", methods=["GET"])
def index():
    return render_template("game.html")


@app.route("/generate/game", methods=["POST"])
def generate_game():
    keywords = generate_keywords()
    prompt = generate_prompt(keywords)
    image = generate_image(prompt)
