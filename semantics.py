import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import spacy

nlp = spacy.load("en_core_web_md")


def word_similarity(word1, word2):
    word1_embedding = nlp(word1).vector.reshape(1, -1)
    word2_embedding = nlp(word2).vector.reshape(1, -1)
    
    similarity_score = cosine_similarity(word1_embedding, word2_embedding)[0][0]

    return similarity_score

word1 = "ship"
word2 = "boat"
score = word_similarity(word1, word2)
print(f"Similarity score between '{word1}' and '{word2}': {score}")
