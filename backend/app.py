import os
import gradio as gr
import uvicorn
from app.main import app as fastapi_app

# Create a clean Gradio interface for status monitoring
with gr.Blocks(title="Fuenzer Sports API") as demo:
    gr.Markdown("""
    # Fuenzer Sports API Backend
    
    FastAPI backend running with high-performance Monte Carlo simulations.
    
    - **Frontend:** [sports.fuenzer.web.id](https://sports.fuenzer.web.id)
    - **API Status:** Active & Healthy
    """)

# Mount Gradio app onto FastAPI app
# This keeps all FastAPI endpoints (/api/simulate, /api/standings/live) active
app = gr.mount_gradio_app(fastapi_app, demo, path="/")

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=7860, reload=False)
