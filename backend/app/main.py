from dotenv import load_dotenv
load_dotenv()
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from app.api import simulate, standings

# Rate Limiter — shared instance, imported by routers
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(title="Fuenzer Sports API", version="0.1.0")

# Attach limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — tighten origins for production, allow localhost for dev/judge testing
ALLOWED_ORIGINS = [
    "https://sports.fuenzer.web.id",
    "http://localhost:5173",   # Vite dev server
    "http://localhost:80",     # Local Docker frontend
    "http://localhost",        # Local Docker (no port)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,  # Not using cookies/sessions via CORS
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

@app.get("/")
def read_root():
    return {"message": "Fuenzer Sports API is running"}

app.include_router(simulate.router, prefix="/api")
app.include_router(standings.router, prefix="/api")
