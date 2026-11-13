# NeuroSig

![React](https://img.shields.io/badge/Frontend-React-149ECA?logo=react&logoColor=white)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Language-Python-3776AB?logo=python&logoColor=white)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white)
![Chart.js](https://img.shields.io/badge/Visualization-Chart.js-FF6384?logo=chartdotjs&logoColor=white)

**NeuroSig** is a full-stack web application for importing, visualizing, and managing EEG recordings.

Users can upload EEG data from CSV files, view interactive signal visualizations, examine channel statistics, and manage saved recordings through a persistent storage system.

---

## Preview

### Landing Page
<img width="3200" height="1698" alt="LandingPage1" src="https://github.com/user-attachments/assets/89af5d4a-696d-4160-8eab-0ace8cefa1d6" />

### Dashboard
<img width="3162" height="1696" alt="Dashboard1" src="https://github.com/user-attachments/assets/8a30fa68-0a3a-4f50-a25a-6c113dd2a924" />

*NeuroSig dashboard — upload and manage EEG recordings.*

### Analysis Page

<img width="3160" height="1728" alt="AnalysisPage1" src="https://github.com/user-attachments/assets/bea1c1af-866c-4146-ba0e-20729648736f" />

<img width="3194" height="1716" alt="AnalysisPageCont1" src="https://github.com/user-attachments/assets/7ca91c29-ee40-49fb-8a3b-989407cba8f7" />

*Interactive EEG visualization and channel statistics.*


---

## Features

- **EEG File Upload** — Import CSV files containing timestamped EEG measurements.
- **Interactive Visualization** — Explore recorded signals with interactive charts and channel controls.
- **Signal Statistics** — Calculate per-channel mean, standard deviation, minimum, and maximum values.
- **Persistent Storage** — Store recording metadata in SQLite and uploaded CSV files on the server.
- **Recording Management** — Preview, retrieve, and permanently delete saved recordings.
- **Data Validation** — Handle invalid CSV formats, missing columns, and empty datasets.

---

## Architecture

NeuroSig uses a client-server architecture with a React frontend and FastAPI backend.

The frontend communicates with the backend through REST endpoints. FastAPI handles CSV parsing, validation, statistics, and recording management.

Recording metadata is stored in SQLite, while the original EEG CSV files are stored separately on the server.

---

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3

### 1. Clone the repository

```bash
git clone https://github.com/TachyonLover/neurosig.git
cd neurosig
```

### 2. Start the backend

```bash
cd backend
python -m venv .venv
```

Activate your virtual environment, then install the required dependencies:

```bash
pip install fastapi uvicorn python-multipart
```

Start the FastAPI server:

```bash
uvicorn main:app --reload
```

Backend: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

### 3. Start the frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local address displayed by Vite, typically `http://localhost:5173`.

---

## Supported CSV Format

NeuroSig accepts CSV files with a `time` column and one or more numeric signal channels.

```csv
time,channel_1,channel_2
0.00,12.5,8.2
0.01,13.1,8.7
0.02,12.8,9.0
```

Each channel is analyzed independently to generate signal statistics and visualizations.

---

## Future Improvements

- Light and dark mode toggle
- More advanced EEG signal processing
- Exportable analysis results
- User authentication
- Cloud deployment

---

## Project Status

**MVP Complete** — Core functionality for uploading, analyzing, storing, retrieving, and deleting EEG recordings has been implemented.

NeuroSig is designed for EEG data exploration and visualization, not medical diagnosis.
