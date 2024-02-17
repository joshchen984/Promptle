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

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-instruct",
        messages=[
            {
                "role": "system",
                "content": "You are a poetic assistant, skilled in explaining complex programming concepts with creative flair.",
            },
            {
                "role": "user",
                "content": "Compose a poem that explains the concept of recursion in programming.",
            },
        ],
        max_tokens=100,
    )
    print(completion.choices)
    return completion.choices[0].message


@app.route("/generate/keywords", methods=["GET"])
def generate_keywords():
    return ""
