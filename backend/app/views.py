from flask import request, abort, jsonify
from app import app
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()
client = OpenAI()


@app.route("/", methods=["GET"])
def index():
    return "hi"


@app.route("/generate/prompt", methods=["GET"])
def generate_prompt():
    keywordsArg = request.args.get("keywords")
    pipe = pipeline(model="succinctly/text2image-prompt-generator")
    return pipe(
        "Here are some keywords I want you to include in the image: [Starry, Galaxy, Cityscape, Rainy, Surreal]"
    )


@app.route("/generate/keywords", methods=["GET"])
def generate_keywords():
    return ""
