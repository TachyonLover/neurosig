from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=False,
    allow_methods=["GET"],
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
def analyze():
    return {"message": "Analysis endpoint reached"}