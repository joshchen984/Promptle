from app import app
from dotenv import load_dotenv


if __name__ == "__main__":
    load_dotenv()
    # Only for debugging while developing
    app.logger.info("Running in debug mode")
    app.run(host="0.0.0.0", debug=True, port=5000)
