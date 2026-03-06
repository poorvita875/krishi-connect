# 🌾 KrishiConnect AI - Smart Farming Assistant

> *"When Farmers Talk, Technology Listens"*

A multilingual AI-powered agricultural companion built for Indian farmers. Available 24/7 in 6 Indian languages - ask questions, detect crop diseases, check hyperlocal weather, and discover government schemes.

 

---

##  Features

| Feature | Description |
|--------|-------------|
|  **AI Chat** | Ask farming questions in English, Kannada, Hindi, Tamil, Telugu, or Marathi |
|  **Pest Detection** | Upload a crop photo for instant AI disease diagnosis + treatment |
|  **Weather** | Hyperlocal 7-day forecast for 6 Karnataka districts with farming advisories |
|  **Govt Schemes** | Browse & apply for PM-KISAN, PMFBY, KCC, Raitha Siri, and more |
|  **Responsive** | Fully optimized for mobile, tablet, and desktop |

---

##  Tech Stack

### Frontend
- **React 18** - UI components with hooks (`useState`, `useRef`, `useEffect`)
- **Vite** - Lightning-fast build tool and dev server
- **Pure CSS** - Custom styling with CSS variables, Flexbox, Grid, 4 responsive breakpoints
- **Google Fonts** - Playfair Display + Noto Sans family (supports all Indian scripts)

### AI / LLM
- **Groq API** — Powers all AI chat and pest analysis
  - Model: `llama-3.1-8b-instant` (Meta's Llama 3.1, hosted on Groq)
  - Sub-second response times (Groq's custom LPU hardware)
  - Free tier available at [console.groq.com](https://console.groq.com)
  - OpenAI-compatible API format

### External APIs
- **Open-Meteo** - Free weather API, no key required
  - Real-time temperature, humidity, wind, precipitation
  - 7-day forecast with WMO weather codes
  - Fallback to seasonal estimates if API is blocked

### Security
- **Vite Environment Variables** — `import.meta.env.VITE_GROQ_KEY` keeps API keys out of code
- **`.gitignore`** - `.env` files never pushed to GitHub
- **Vercel Environment Variables** — Key stored securely server-side for production

---



**In KrishiConnect, Groq is used for two things:**

### 1. AI Chat (multilingual farming assistant)
```
User types question → App sends to Groq API with system prompt →
Groq runs Llama 3.1 → Returns answer in farmer's chosen language
```
The system prompt tells the model to respond in the selected language and behave like a friendly farming expert. The last 10 messages are sent as conversation history so the AI remembers context.

### 2. Pest & Disease Analysis
```
User uploads crop photo → App describes image to Groq →
Groq analyzes based on common crop diseases →
Returns: disease name, severity, treatment, prevention
```

**API call structure (OpenAI-compatible):**
```js
fetch("https://api.groq.com/openai/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer " + GROQ_KEY,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "llama-3.1-8b-instant",
    messages: [
      { role: "system", content: "You are a farming expert..." },
      { role: "user", content: "What fertilizer for rice?" }
    ],
    max_tokens: 1024
  })
})
```

---

##  Quick Start (Local Development)

```bash
# Clone the repo
git clone https://github.com/poorvita875/krishi-connect.git
cd krishi-connect

# Install dependencies
npm install

# Create environment file
echo "VITE_GROQ_KEY=your_groq_key_here" > .env

# Start development server
npm run dev
```

Open **http://localhost:5173**


---

## 📁 Project Structure

```
krishi-connect/
├── src/
│   └── KrishiConnect.jsx    # Entire app (single-file React)
├── public/
│   └── vite.svg
├── .env                     # Local secrets (never committed)
├── .gitignore               # Excludes .env from git
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

##  Deployment on Vercel

1. Push code to GitHub (see above)
2. Go to [vercel.com](https://vercel.com) → **Sign up with GitHub**
3. Click **Add New Project** → Select `krishi-connect`
4. Before deploying, add **Environment Variable:**
   - Key: `VITE_GROQ_KEY`
   - Value: *(your real Groq API key)*
5. Click **Deploy** 

Your app will be live at `https://krishi-connect.vercel.app`

---

## Supported Languages

| Language | Script |
|----------|--------|
| English | Latin |
| ಕನ್ನಡ (Kannada) | Kannada |
| हिंदी (Hindi) | Devanagari |
| தமிழ் (Tamil) | Tamil |
| తెలుగు (Telugu) | Telugu |
| मराठी (Marathi) | Devanagari |

---

##  License

MIT - Made by a student who believes technology should serve farmers first.
