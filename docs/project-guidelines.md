# Fuenzer Sports Project Guidelines & Standards

This document outlines the core architecture and development standards for **Fuenzer Sports**, focusing on open innovation, performance benchmarks, and deployment constraints.

## Architecture & Innovation Standards

### Core Objectives
An original AI-driven sports analytics simulation platform leveraging vectorized compute and open-source models. Focuses on high-throughput parallel execution, intuitive zero-friction search interface, and realistic tournament modeling.

> "Your idea. Open infrastructure. High performance, zero friction — just build."

### Quality & Deliverables

| Item | Status | Description |
|---|---|---|
| GitHub repository | Active | Full source code for frontend, backend, and infra |
| Live demo / hosted URL | Active | https://sports.fuenzer.web.id |
| Docker orchestration | Supported | Linux/amd64 production containerization |
| API Docs | Integrated | FastAPI interactive OpenAPI/Swagger docs |

### Quality Pillars
- **Creativity**: Interactive AI-driven prompt-to-workspace tournament predictions.
- **Completeness**: End-to-end MVP from Monte Carlo execution to real-time UI animation.
- **Compute Acceleration**: Vectorized NumPy computations accelerated on GPU hardware and open-weights models.
- **Product/Market Viability**: Ready for B2B odds calculation and B2C custom esports/fantasy leagues.

## System & Performance Benchmarks
- Service container ready state within **60 seconds**.
- Response latency per simulation prompt targeted under **30 seconds**.
- Container images standardized for `linux/amd64` multi-platform deployments.
- All responses must be in **English**.
- **Do not hardcode or cache answers** to specific inputs — evaluation uses unseen variants.
- Container images must be publicly pullable at submission time.

## Image Architecture Requirement
The production deployment runs `linux/amd64`. Your image must include a `linux/amd64` manifest. 

If you build on Apple Silicon (M1/M2/M3), add `--platform linux/amd64` to your build command:
```shell
docker buildx build --platform linux/amd64 --tag your-image:latest --push .
```
Standard `linux/amd64` builds (e.g., built on Intel/AMD or GitHub Actions) are fine without any changes.
