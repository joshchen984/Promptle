import openai
from dotenv import load_dotenv
import re

load_dotenv()
client = openai.OpenAI()


def generate_prompt(keywords: str):

    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a prompt engineer and an expert in creating prompts for Dall-e. Limit all responses to 50 tokens please.",
            },
            {
                "role": "user",
                "content": f"Generate a dall e prompt that incorporates the following keywords: [{keywords}]",
            },
        ],
        max_tokens=50,
    )
    return completion.choices[0].message.content


def generate_keywords():
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": "Create a list of ten keywords separated by commas to use to generate an image.pip Include a keyword for the style of the image, but do not include the label of Style. The keywords can be related to anything. Keep this in a single line",
            },
        ],
        max_tokens=30,
    )
    result = completion.choices[0].message.content
    # Getting rid of whitespace around commas
    return re.sub(r"\s*,\s*", ",", result)


def generate_image(prompt):
    response = client.images.generate(
        model="dall-e-2",
        prompt=prompt,
        size="512x512",
        quality="standard",
        n=1,
    )
    image_url = response.data[0].url
    return image_url
