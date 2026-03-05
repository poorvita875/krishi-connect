# KrishiConnect AI – Smart Farming Assistant

A multilingual AI-powered agricultural companion available 24/7 in your language. Designed for Indian farmers with features for crop disease detection, government scheme lookup, weather forecasting, and AI chat assistance.

## Features

- 🤖 **AI Chat Assistant** – Ask any farming-related questions in English, Kannada, Hindi, Tamil, Telugu, or Marathi
- 🔍 **Pest & Disease Detection** – Upload crop photos for instant AI diagnosis and treatment recommendations
- 🌤️ **Hyperlocal Weather Forecasting** – Real-time alerts for your district with farming-specific advisory
- 💰 **Government Schemes Database** – Search and apply for agricultural subsidies (PM-KISAN, MSP, etc.)
- 🌾 **Responsive Design** – Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend Proxy**: Node.js + Express
- **LLM Provider**: Google Generative AI (Gemini) or Hugging Face (free tier)
- **Languages**: 6 Indian languages + English

## Quick Start

```bash
# Install frontend
npm install

# Install and run server proxy
# the back end listens on port 5176 by default (5174 and 5175 were noisy on Windows)
cd server && npm install
# set PORT if you prefer another value
node index.js

# In another terminal, run frontend
npm run dev
```

Open http://localhost:5173 (front end) and note that the proxy will
run at http://localhost:5176 by default.

### Demo Mode

The app works without an API key – returns mock farming tips for demos.

### Using a real LLM API key (Gemini, Anthropic or Hugging Face)

You can use any of the following keys; the proxy will pick the first one it finds:

```ini
# Hugging Face (free tier)
HF_API_KEY=your_hf_key
HF_MODEL=gpt2          # optional, default is gpt2

# or Google Gemini
VITE_GEMINI_API_KEY=your_key_here

# or Anthropic Claude
ANTHROPIC_API_KEY=sk-...
```

Hugging Face provides a generous free quota and is easiest for students; you can sign up for a token at https://huggingface.co/settings/tokens.  
> **Note:** HF recently migrated to a new router endpoint. The proxy automatically uses `https://router.huggingface.co/...` under the hood, so you don’t need to change anything – just ensure your key is valid and restart the server.

After editing `.env`, restart the proxy with:

```bash
cd server
node index.js
```

## Architecture

Browser (React) → Proxy (Node) → Google Gemini / Mock responses

**Why a proxy?**
- Hides API keys (security)
- Avoids CORS blocks
- Easy provider swapping

## File Structure

```
krishi-connect/
├── src/KrishiConnect.jsx    # Main app
├── server/index.js           # Express proxy gateway
├── README.md                 # This file
└── package.json
```

## Deployment

Push to GitHub → Connect Vercel → Set `VITE_GEMINI_API_KEY` env → Deploy

## License

MIT – Made with ❤️ for Indian farmers.
