from flask import request, abort, jsonify
from app import app


@app.route("/", methods=["GET"])
def index():
    return "hi"


@app.route("/generate/prompt", methods=["GET"])
def generate_prompt():
    pass
