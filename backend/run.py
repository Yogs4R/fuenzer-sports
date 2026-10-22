import os
import uvicorn
from app.main import app as fastapi_app

try:
    import gradio as gr
    # Create a clean Gradio interface for status monitoring if gradio is installed
    with gr.Blocks(title="Fuenzer Sports API") as demo:
        gr.Markdown("""
        # Fuenzer Sports API Backend
        
        FastAPI backend running with high-performance Monte Carlo simulations.
        
        - **Frontend:** [sports.fuenzer.web.id](https://sports.fuenzer.web.id)
        - **API Status:** Active & Healthy
        """)
    # Mount Gradio app onto FastAPI app
    app = gr.mount_gradio_app(fastapi_app, demo, path="/")
except ImportError:
    # Direct FastAPI fallback when gradio is not installed
    app = fastapi_app

if __name__ == "__main__":
    uvicorn.run("run:app", host="0.0.0.0", port=7860, reload=False)
