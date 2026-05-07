import ollama

from app.services.vector_service import search_similar


def generate_summary():

    relevant_chunks = search_similar("summarize document")

    context = "\n".join(relevant_chunks)

    prompt = f"""
Summarize the following content clearly and briefly.

Content:
{context}
"""

    response = ollama.chat(
        model="tinyllama",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]