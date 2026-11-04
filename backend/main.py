from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import csv
import io

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

    # List of every channel in the form of strings
    channels = [column for column in columns if column != "time"]

    #If no channels, raise HTTP exception
    if not columns or "channel_1" not in columns:
        raise HTTPException(
            status_code = 400,
            detail="CSV must contain a channel_1 column"
    )

    total = 0
    for row in rows:
        channel_1_val = float(row.get("channel_1"))
        total += channel_1_val

    total = round(total, 2)

    channel_1_avg = round(total/row_count, 2)

    # Calculates totals for each channel
    totals = {}

    for ch_name in channels:
        totals[ch_name] = 0

    for row in rows:
        for channel in channels:
            totals[channel] += float(row.get(channel))


    # Calculates average for each channel
    averages = {}
    for channel in channels:
        averages[channel] = round(totals.get(channel)/len(rows), 3)
    

    return {"filename": file.filename,
            "row_count": row_count,
            "columns": columns,
            "channels": channels,
            "averages": averages}