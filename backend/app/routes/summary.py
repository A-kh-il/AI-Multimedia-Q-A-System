from fastapi import APIRouter

from app.services.summary_service import generate_summary

router = APIRouter()

@router.get("/summary")
def summary():

    result = generate_summary()

    return {
        "summary": result
    }