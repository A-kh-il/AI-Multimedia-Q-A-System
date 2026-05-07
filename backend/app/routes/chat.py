from fastapi import APIRouter
from app.services.chat_service import ask_question

router = APIRouter()

@router.post("/chat")
async def chat(question: str):

    answer = ask_question(question)

    return {
        "question": question,
        "answer": answer
    }