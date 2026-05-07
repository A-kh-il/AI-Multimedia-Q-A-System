import whisper

model = whisper.load_model("base")

def transcribe_audio(file_path):

    result = model.transcribe(file_path)

    segments = []

    for segment in result["segments"]:

        segments.append({
            "start": segment["start"],
            "end": segment["end"],
            "text": segment["text"]
        })

    return {
        "text": result["text"],
        "segments": segments
    }