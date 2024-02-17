from flask import request, abort, jsonify, render_template
from app import app
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM, pipeline
from dotenv import load_dotenv
import os
import openai
from dotenv import load_dotenv

load_dotenv()
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
                "content": "Create a list of ten keywords separated by commas to use to generate an image. Include a keyword for the style of the image, but do not include the label of Style. The keywords can be related to anything. Keep this in a single line",
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
