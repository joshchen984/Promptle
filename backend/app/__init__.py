from flask import Flask
import os
import os


def create_app():
    """Creates configured app"""

    app = Flask(__name__)
    return app


app = create_app()
from app import views
