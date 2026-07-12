FROM python:3.10-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user for security (HF Spaces requires uid 1000)
RUN useradd -m -u 1000 user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

WORKDIR $HOME/app
# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip setuptools wheel jaraco.context \
    && pip install --no-cache-dir --upgrade -r requirements.txt

# Copy project and set ownership
COPY --chown=user:user . $HOME/app

# Switch to non-root user
USER user

# Expose port (HF Spaces defaults to 7860)
EXPOSE 7860

# Run FastAPI with Uvicorn using dynamic port for Render/local fallback
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
