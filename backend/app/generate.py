import re
import random
import openai
from dotenv import load_dotenv
from app.image_configuration import genres


load_dotenv()
client = openai.OpenAI()


def generate_prompt():
    genre = random.choice(genres)
    system_message = """
        You are a prompt engineer and an expert in creating prompts for Dall-e. Limit all responses to 50 tokens please.

        Here are some dall-e prompt tips:
        Be Specific and Detailed: The more specific your prompt, the better the image quality. Include details like the setting, objects, colors, mood, and any specific elements you want in the image.

        Mood and Atmosphere: Describe the mood or atmosphere you want to convey. Words like “serene,” “chaotic,” “mystical,” or “futuristic” can guide the AI in setting the right tone.

        Use Descriptive Adjectives: Adjectives help in refining the image. For example, instead of saying “a dog,” say “a fluffy, small, brown dog.”

        Consider Perspective and Composition: Mention if you want a close-up, a wide shot, a bird’s-eye view, or a specific angle. This helps in framing the scene correctly.

        Specify Lighting and Time of Day: Lighting can dramatically change the mood of an image. Specify if it’s day or night, sunny or cloudy, or if there’s a specific light source like candlelight or neon lights.
        Incorporate Action or Movement: If you want a dynamic image, describe actions or movements. For instance, “a cat jumping over a fence” is more dynamic than just “a cat.”

        Avoid Overloading the Prompt: While details are good, too many can confuse the AI. Try to strike a balance between being descriptive and being concise.

        Use Analogies or Comparisons: Sometimes it helps to compare what you want with something well-known, like “in the style of Van Gogh” or “resembling a scene from a fantasy novel.”
    """
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": system_message,
            },
            {
                "role": "user",
                "content": f"Generate a dall e prompt that incorporates the following genre: {genre}",
            },
        ],
        max_tokens=50,
    )
    return completion.choices[0].message.content


def generate_keywords(prompt: str):
    message = f"""
        List the 10 keywords that most describe the image created by this dall-e prompt. The keywords should be one word and easy for a person to guess from the image. Make the response one line and comma separated:

        {prompt}
    """
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": message,
            },
        ],
        max_tokens=30,
    )
    result = completion.choices[0].message.content
    return re.sub(r"\s*,\s*", ",", result).lower()


def generate_image(prompt):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )
    image_url = response.data[0].url
    return image_url
