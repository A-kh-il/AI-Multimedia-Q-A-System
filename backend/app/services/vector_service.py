import faiss
import pickle
import numpy as np
import os

from sentence_transformers import SentenceTransformer


model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)

INDEX_FILE = "faiss_index.bin"

TEXTS_FILE = "texts.pkl"


def store_embedding(text):

    chunks = text.split(". ")

    chunks = [
        chunk.strip()
        for chunk in chunks
        if chunk.strip()
    ]

    # Prevent empty chunk errors
    if len(chunks) == 0:
        print("No valid chunks found")
        return

    embeddings = model.encode(chunks)

    embeddings = np.array(
        embeddings
    ).astype("float32")

    dimension = embeddings.shape[1]

    if os.path.exists(INDEX_FILE):

        index = faiss.read_index(INDEX_FILE)

        with open(TEXTS_FILE, "rb") as f:
            stored_chunks = pickle.load(f)

    else:

        index = faiss.IndexFlatL2(dimension)

        stored_chunks = []

    index.add(embeddings)

    stored_chunks.extend(chunks)

    faiss.write_index(index, INDEX_FILE)

    with open(TEXTS_FILE, "wb") as f:
        pickle.dump(stored_chunks, f)

    print("Embedding stored successfully")
    print("Total chunks:", len(stored_chunks))


def search_similar(query, top_k=5):

    if not os.path.exists(INDEX_FILE):

        print("FAISS index not found")

        return []

    index = faiss.read_index(INDEX_FILE)

    with open(TEXTS_FILE, "rb") as f:
        stored_chunks = pickle.load(f)

    query_embedding = model.encode([query])

    query_embedding = np.array(
        query_embedding
    ).astype("float32")

    distances, indices = index.search(
        query_embedding,
        top_k
    )

    results = []

    for idx in indices[0]:

        if 0 <= idx < len(stored_chunks):

            results.append(
                stored_chunks[idx]
            )

    print("Retrieved Chunks:", results)

    return results