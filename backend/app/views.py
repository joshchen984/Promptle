from flask import request, abort, jsonify, render_template
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
    return render_template("game.html")


@app.route("/generate/prompt", methods=["GET"])
def generate_prompt():
    keywordsArg = request.args.get("keywords")

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-instruct",
        messages=[
            {
                "role": "system",
                "content": "You are a prompt engineer and an expert in creating prompts for Dall-e.",
            },
            {
                "role": "user",
                "content": f"Generate a dall e prompt that incorporates the following keywords: [{keywordsArg}]",
            },
        ],
        max_tokens=30,
    )
    return completion.choices[0].message


@app.route("/generate/keywords", methods=["GET"])
def generate_keywords():
    return ""
