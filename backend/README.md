---
title: Fuenzer Sports Backend
emoji: 🏆
colorFrom: blue
colorTo: gray
sdk: gradio
app_file: app.py
pinned: false
---

# ⚙️ Fuenzer Sports — Backend (FastAPI & AI Engine)

The high-performance analytical engine for **Fuenzer Sports**. It runs vectorized Monte Carlo tournament simulations and orchestrates dual-provider LLM responses.

## 🛠️ Technology Stack
- **Framework:** FastAPI (Python 3.10+)
- **Data Computations:** NumPy (vectorized parallel operations for rapid Monte Carlo iterations)
- **AI Routing & Fallbacks:** OpenAI/Fireworks client integrations
- **validation:** Pydantic v2
- **Hosting Adaptability:** Compatible with both local Docker and free HuggingFace Gradio SDK mounting.

## 🧠 AI Architecture (Dual-Provider & AMD ROCm)
To achieve high performance while staying cost-effective and compliant with AMD GPU guidelines:
- **Fast Endpoints:** Routed to `deepseek-v4-flash` via Fireworks serverless API for immediate, simple prompts.
- **Pro & Vision Endpoints:** Routed to a local **Google Gemma 4** model deployed on **AMD Instinct MI300X** GPUs via `vLLM` with ROCm support.
- **Vision & Reliability Fallback:** If the local AMD notebook server goes down, the backend dynamically falls back to the `minimax-m3` multimodal vision model on Fireworks.

## 💻 Local Setup & Development

### 1. Prerequisites
Ensure you have Python 3.10+ installed.

### 2. virtual Environment Setup
Navigate to the `backend/` directory:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` directory:
```env
FOOTBALL_DATA_API_KEY=your_key_here
FIREWORKS_API_KEY=your_key_here
LOCAL_MODEL_BASE_URL=https://your-cloudflare-tunnel-url.trycloudflare.com/v1
```

### 4. Running the API
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
```
API Documentation will be available at [http://localhost:8000/docs](http://localhost:8000/docs).

## 🚀 Hugging Face Spaces Deployment (Gradio Wrapper)
This backend is configured to run on Hugging Face Spaces' **free Gradio tier** by mounting the FastAPI app:
1. Create a Space on Hugging Face using the **Gradio SDK** (Blank template).
2. Push or upload the contents of the `/backend` folder directly to the root of the Space.
3. Hugging Face will automatically run `app.py` and install dependencies from `requirements.txt`.
