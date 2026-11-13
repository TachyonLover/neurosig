from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import init_database,get_recording, get_recordings, add_recording, delete_recording
from pydantic import BaseModel
from pathlib import Path
from uuid import uuid4
import csv
import io
import math
import statistics

UPLOAD_DIR = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

class RecordingCreate(BaseModel):
     filename: str
     row_count: int
     channel_count: int

@asynccontextmanager
async def lifespan(app: FastAPI):
     init_database()
     yield

app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Neurosig backend is running"}

@app.get("/status")
def get_status():
    return {"status": "ready",
            "application": "NeuroSig",
            "supported_format": "CSV"}

@app.get("/recordings/{recording_id}")
def read_recording(recording_id: int):
    recording = get_recording(recording_id)

    if recording is None:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    recording = dict(recording)

    if not recording["file_path"]:
        raise HTTPException(
            status_code=404,
            detail="Recording has not associated CSV file"
        )

    file_path = UPLOAD_DIR / recording["file_path"]

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Recording CSV file not found"
        )

    text = file_path.read_text(encoding="utf-8")

    rows, columns = parse_csv(text)

    channels = [column for column in columns if column != "time"]

    stats = calculate_statistics(rows, channels)

    return {
        **recording,
        "columns": columns,
        "channels": columns,
        **stats
    }

@app.delete("/recordings/{recording_id}")
def remove_recording(recording_id: int):
    recording = get_recording(recording_id)

    if recording is None:
        raise HTTPException(
            status_code=404,
            detail="Recording not found"
        )

    recording = dict(recording)

    if recording["file_path"]:
        file_path = UPLOAD_DIR / recording["file_path"]
        file_path.unlink(missing_ok=True)

    delete_recording(recording_id)

    return{"message": "Recording deleted successfully"}

@app.get("/recordings")
def list_recordings():
     recordings = get_recordings()

     return {
          "recordings": [dict(recording) for recording in recordings]
     }


@app.post("/recordings", status_code=201)
async def create_recording(file: UploadFile = File()):
    contents = await file.read()

    try:
        text = contents.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="File must be UTF-8 encoded"
        )

    rows, columns = parse_csv(text)

    if not columns or "time" not in columns or not rows:
        raise HTTPException(
            status_code=400,
            detail="Invalid EEG CSV"
        )

    channels = [column for column in columns if column != "time"]

    if not channels:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no EEG channels"
        )

    # Validate measurements before saving
    calculate_statistics(rows, channels)

    filename = f"{uuid4().hex}.csv"
    file_path = UPLOAD_DIR / filename

    file_path.write_bytes(contents)

    try:
        recording_id = add_recording(
            filename=file.filename,
            row_count=len(rows),
            channel_count=len(channels),
            file_path=filename
        )
    except Exception:
        file_path.unlink(missing_ok=True)
        raise

    return {
        "id": recording_id,
        "filename": file.filename,
        "row_count": len(rows),
        "channel_count": len(channels),
        "message": "Recording saved successfully"
    }

def parse_csv(text):
    csv_file = io.StringIO(text)
    reader = csv.DictReader(csv_file)
    if reader.fieldnames:
                reader.fieldnames = [
                    name.strip().lower()
                    for name in reader.fieldnames
                ]
    rows = []

    for row in reader:
        if all(
            str(row.get(column, "")).strip().lower() == column
            for column in reader.fieldnames
        ):
            continue

        rows.append(row)
        columns = reader.fieldnames
    

    return rows, columns

def calculate_statistics(rows, channels):

    timestamps = []
    for row_number, row in enumerate(rows,start=1):
        try:
            timestamp = float(row.get("time"))

            if not math.isfinite(timestamp):
                raise HTTPException(
                    status_code=400,
                    detail=f"Time column contains a non-finite value at row {row_number}"
                )
            
        except (ValueError, TypeError):
            print(f"Invalid timestamp at row {row_number}")
            print(f"Raw value: {repr(row.get('time'))}")
            raise HTTPException(
                status_code=400,
                detail=f"Time column contains invalid values at row {row_number}"
            )

        timestamps.append(timestamp)


    # Initialize lists for each channel which contains measurements
    measurements = {}
    standard_devs = {}

    # Calculates totals for each channel
    totals = {}
    minimums = {channel:float("inf") for channel in channels}
    maximums = {channel:float("-inf") for channel in channels}

    # Initializes channel lists in respective dictionaries
    for channel in channels:
        measurements[channel] = []
        totals[channel] = 0

    for row_number, row in enumerate(rows,start=1):
        for channel in channels:
            try:
                value = float(row.get(channel))
                if not math.isfinite(value):
                    raise HTTPException(
                        status_code=400,
                        detail=f"CSV contains non-finite measurement in channel '{channel}' at row {row_number}"
                    )
                
            except (ValueError, TypeError):
                raise HTTPException(
                    status_code=400,
                    detail=f"CSV contains invalid measurement in channel '{channel}' at row {row_number}"
                )

            measurements[channel].append(value)
            totals[channel] += value
            minimums[channel] = min(minimums[channel], value)
            maximums[channel] = max(maximums[channel], value)

    # Calculates standard deviations for each channel
    for channel in channels:
        standard_devs[channel] = round(statistics.pstdev(measurements[channel]), 3)

    # Calculates average for each channel
    averages = {}
    for channel in channels:
        averages[channel] = round(totals.get(channel)/len(rows), 4)

    return {
        "timestamps": timestamps,
        "averages": averages,
        "minimums": minimums,
        "maximums": maximums,
        "standard_devs": standard_devs,
        "measurements": measurements
    }

@app.post("/analyze")
async def analyze(file: UploadFile = File()):
    contents = await file.read()
    text = contents.decode("utf-8")
    rows, columns = parse_csv(text)
    row_count = len(rows)

    
    # Checks if there are columns and then rows
    if not columns:
        raise HTTPException(
            status_code = 400,
            detail="CSV must contain column headers"
    )

    if "time" not in columns:
        raise HTTPException(
            status_code=400,
            detail="CSV must contain a 'time' column"
        )

    if not rows:
            raise HTTPException(
                status_code = 400,
                detail = "CSV file contains no measurements"
            )

    # List of every channel in the form of strings
    channels = [column for column in columns if column != "time"]

    if not channels:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no EEG channels"
        )

    stats = calculate_statistics(rows, channels)

    return {"filename": file.filename,
            "row_count": row_count,
            "columns": columns,
            "channels": channels,
            **stats
    }