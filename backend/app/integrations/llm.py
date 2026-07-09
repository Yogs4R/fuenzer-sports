import os
import json
from openai import OpenAI
from typing import List, Dict, Any

def get_model_name(selected_model: str, prompt: str) -> str:
    fast_model = "google/gemini-2.5-flash-lite"
    pro_model = "openai/gpt-oss-120b"
    
    if selected_model == "Fast":
        return fast_model
    elif selected_model == "Pro":
        return pro_model
    else: # Auto
        # Basic heuristic for complexity
        complex_keywords = [
            "analyze", "detail", "why", "explain", "deep", "compare", "strategy", "tactics",
            "analisis", "kenapa", "jelaskan", "detail", "bandingkan", "strategi"
        ]
        prompt_lower = prompt.lower()
        if len(prompt.split()) > 15 or any(k in prompt_lower for k in complex_keywords):
            return pro_model
        return fast_model

def generate_narrative(
    prompt: str,
    chat_history: List[Any],
    simulation_results: Dict[str, Any],
    selected_model: str,
    competition: str,
    mode: str,
    style: str
) -> str:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        return "AI integration is not configured. (Missing OPENROUTER_API_KEY)"

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
    )
    
    model_name = get_model_name(selected_model, prompt)
    
    sim_context = json.dumps(simulation_results, default=str)
    if len(sim_context) > 10000:
        sim_context = sim_context[:10000] + "... (truncated)"

    system_prompt = f"""You are a sports simulation AI assistant for the {competition}.
Your current mode is: {mode}
Your persona/style is: {style}

Current Simulation Context (JSON excerpt):
{sim_context}

Rules:
1. Answer the user's prompt based on the simulation context provided.
2. Adopt the requested persona/style strictly.
3. Keep the response concise, engaging, and directly answer the prompt.
4. Do not output raw JSON, weave the data naturally into your narrative.
"""

    messages = [{"role": "system", "content": system_prompt}]
    
    for msg in chat_history[-6:]:
        role = "user" if msg.role == "user" else "assistant"
        messages.append({"role": role, "content": msg.content})
        
    messages.append({"role": "user", "content": prompt})

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=messages,
            timeout=15.0
        )
        return response.choices[0].message.content
    except Exception as e:
        raise RuntimeError(f"LLM API Error: {str(e)}")
