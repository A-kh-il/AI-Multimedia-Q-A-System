import ollama

from app.services.vector_service import search_similar


def ask_question(question):

    relevant_chunks = search_similar(question)

    context = "\n".join(relevant_chunks)

    print("Relevant Chunks:", relevant_chunks)

    if not context.strip():

        return "No relevant information found in the uploaded file."

    prompt = f"""
Context:
{context}

Question:
{question}

Answer naturally and briefly based on the context.
"""

    response = ollama.chat(
        model="gemma:2b",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    return response["message"]["content"]