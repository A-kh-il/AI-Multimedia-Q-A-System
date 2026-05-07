from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os

from app.database.mongodb import collection
from app.services.pdf_service import extract_pdf_text
from app.services.transcription_service import transcribe_audio
from app.services.vector_service import store_embedding

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):

    # Empty file check
    if file.filename == "":

        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    # Allowed file types
    allowed_extensions = (
        ".pdf",
        ".mp3",
        ".wav",
        ".mp4"
    )

    if not file.filename.endswith(allowed_extensions):

        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    file_path = f"{UPLOAD_FOLDER}/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    response = {
        "message": "File uploaded successfully",
        "filename": file.filename
    }

    # PDF extraction
    if file.filename.endswith(".pdf"):

        text = extract_pdf_text(file_path)

        response["preview"] = text[:1000]

        # Store embeddings
        store_embedding(text)

    # Audio / Video transcription
    elif file.filename.endswith((".mp3", ".wav", ".mp4")):

        transcript = transcribe_audio(file_path)

        response["transcript"] = transcript["text"][:1000]

        # Store timestamp segments
        response["segments"] = transcript["segments"]

        # Store embeddings
        store_embedding(transcript["text"])

    # Save to MongoDB
    mongo_data = response.copy()

    inserted = collection.insert_one(mongo_data)

    response["id"] = str(inserted.inserted_id)

    return response