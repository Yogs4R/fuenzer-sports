from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import simulate, standings

app = FastAPI(title="Fuenzer Sports API", version="0.1.0")

# Setup CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, tighten this in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Fuenzer Sports API is running"}

app.include_router(simulate.router, prefix="/api")
app.include_router(standings.router, prefix="/api")
