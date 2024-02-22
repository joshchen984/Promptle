import openai
from dotenv import load_dotenv
import re
import spacy
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

nlp = spacy.load("en_core_web_md")

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


def remove_similar_keywords(keywords):
    word_embeddings = [nlp(word).vector for word in keywords]
    word_embeddings = np.array(word_embeddings)

    similarity_matrix = cosine_similarity(word_embeddings)

    # True if keyword should be kept
    kept_words = [True] * len(keywords)

    threshold = 0.50
    for i in range(len(word_embeddings) - 1):
        for j in range(i + 1, len(word_embeddings)):
            if similarity_matrix[i, j] >= threshold:
                kept_words[i] = False
                break

    updated_keywords = [keyword for keyword, keep in zip(keywords, kept_words) if keep]

    return updated_keywords


def get_updated_keywords(keywords):
    prompt = (
        f"Create a comma-separated list of {10 - len(keywords)} keywords to use to generate an image. "
        "The keywords shouldn't be related to any of the following keywords:"
        f"{','.join(keywords)}"
        ". Keep this in a single line."
    )
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": prompt,
            },
        ],
        max_tokens=30,
    )
    result = completion.choices[0].message.content
    # Getting rid of whitespace around commas
    result = re.sub(r"\s*,\s*", ",", result).lower()
    return result.split(",")


def generate_keywords():
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "user",
                "content": "Create a comma-separated list of ten keywords to use to generate an image. Keep this in a single line.",
            },
        ],
        max_tokens=30,
    )
    result = completion.choices[0].message.content
    # Getting rid of whitespace around commas
    result = re.sub(r"\s*,\s*", ",", result).lower()
    keywords = result.split(",")
    keywords = remove_similar_keywords(keywords)
    while len(keywords) < 10:
        new_keywords = get_updated_keywords(keywords)
        new_keywords = remove_similar_keywords(new_keywords)
        keywords = keywords + new_keywords

    if len(keywords) > 10:
        keywords = keywords[:10]
    # Getting rid of whitespace around commas
    return re.sub(r"\s*,\s*", ",", ",".join(keywords)).lower()


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
