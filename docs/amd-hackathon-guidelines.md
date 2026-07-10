# AMD Developer Hackathon: Act 2 Guidelines

This document outlines the official guidelines for the AMD Developer Hackathon, specifically focusing on **Track 3: Unicorn (Open Innovation)**, as provided by the competition committee.

## Track 3: Unicorn (Open Innovation)

### What you are building
An original AI application that uses AMD compute resources. There is no fixed task; we are looking for the most innovative, technically impressive, and practically useful projects.

> "Your idea. AMD infrastructure. No benchmarks, no constraints — just build."
> "Think startup pitch, not benchmark run."

### What to submit

| Item | Required |
|---|---|
| GitHub repository URL | Yes |
| Demo video | Yes |
| Slide deck | Yes |
| Live demo / hosted URL | Optional but recommended |

*Note: automated pre-screening only inspects the GitHub repository, slide deck (PDF), and live demo/hosted URL — it does not process the demo video. No Docker image is required for Track 3.*

### Judging
Submissions are pre-screened automatically for AMD resource usage and originality, then reviewed by human judges. **AMD compute usage is a requirement**: projects that do not demonstrate it will be disqualified.

**Key Judging Criteria:**
- **Creativity**: Originality of the idea and novel approaches.
- **Originality**: Highlighting new behaviors or untapped market segments.
- **Completeness**: A fully realized and functional project from end to end.
- **Use of AMD Platforms**: Meaningful incorporation of AMD GPUs and/or Fireworks AI API.
- **Product/market potential**: Startup pitch viability and potential in a real market context.

## General Rules (All Tracks)
- Your container must start and be ready within **60 seconds**.
- Response time per request must be under **30 seconds**.
- All responses must be in **English**.
- **Do not hardcode or cache answers** to specific inputs — evaluation uses unseen variants.
- Container images must be publicly pullable at submission time.

## Image Architecture Requirement
The judging VM runs `linux/amd64`. Your image must include a `linux/amd64` manifest or it will fail to pull and score zero. 

If you build on Apple Silicon (M1/M2/M3), add `--platform linux/amd64` to your build command:
```shell
docker buildx build --platform linux/amd64 --tag your-image:latest --push .
```
Standard `linux/amd64` builds (e.g., built on Intel/AMD or GitHub Actions) are fine without any changes.
