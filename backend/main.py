from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import csv
import io
import math
import statistics

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
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

@app.post("/analyze")
async def analyze(file: UploadFile = File()):
    contents = await file.read()
    text = contents.decode("utf-8")
    csv_file = io.StringIO(text)
    reader = csv.DictReader(csv_file)
    rows = list(reader)

    if not rows:
        raise HTTPException(
            status_code = 400,
            detail = "CSV file contains no measurements"
        )
    
    row_count = len(rows)
    columns = reader.fieldnames


    #If no columns/headers, raise HTTP exception
    if not columns:
        raise HTTPException(
            status_code = 400,
            detail="CSV must contain column headers"
    )

    # List of every channel in the form of strings
    channels = [column for column in columns if column != "time"]

    if not channels:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no EEG channels"
        )

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
    

    return {"filename": file.filename,
            "row_count": row_count,
            "columns": columns,
            "channels": channels,
            "averages": averages,
            "maximums": maximums,
            "minimums": minimums,
            "standard_devs": standard_devs,
            "measurements": measurements}