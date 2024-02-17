from flask import request, abort, jsonify, render_template
from app import app
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
import os
import openai
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import spacy

load_dotenv()
print(os.environ.get("OPENAI_API_KEY"))
client = openai.OpenAI()


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
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo-instruct",
        messages=[
            {
                "role": "user",
                "content": "Create a list of ten keywords separated by commas to use to generate an image.pip Include a keyword for the style of the image, but do not include the label of Style. The keywords can be related to anything. Keep this in a single line",
            },
        ],
        max_tokens=30,
    )
    return completion.choices[0].message


@app.route("/generate/images", methods=["GET"])
def generate_image():
    prompt = request.args.get("prompt")
    response = client.images.generate(
        model="dall-e-2",
        prompt=prompt,
        size="512x512",
        quality="standard",
        n=1,
    )
    image_url = response.data[0].url
    return image_url

@app.route("/similarity", methods = ["GET"])
def word_similarity():
    nlp = spacy.load("en_core_web_md")
    word1 = request.args.get("word1")
    word2 = request.args.get("word2")

    word1_embedding = nlp(word1).vector.reshape(1, -1)
    word2_embedding = nlp(word2).vector.reshape(1, -1)
        
    similarity_score = cosine_similarity(word1_embedding, word2_embedding)[0][0]

    return str(similarity_score)

    