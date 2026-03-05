require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Mock responses for demo mode
const mockResponses = [
  '🌾 For rice farming in Karnataka, use drip irrigation to save 50% water. Best season: June-July.',
  '💧 Recommended fertilizer for rice: 15-15-15 NPK during sowing, then 30kg urea per acre at tillering.',
  '🐛 If you see brown hopper attacks, spray neem oil or use carbofuran. Act within 3-5 days.',
  '📈 Check the PM-KISAN scheme — ₹6,000 annual support. Register at pmkisan.gov.in.',
  '🌤️ High humidity (>80%) increases fungal risk. Monitor leaves for powdery mildew. Use preventive fungicide if needed.',
  '✂️ Harvest rice when grains are 20% moisture. Best time: early morning. Yields improve with proper spacing (25cm).',
  '🌱 Intercropping legumes with cereals naturally enriches soil nitrogen and reduces pest pressure.',
  '💰 PM-KISAN provides ₹2,000 per acre every 4 months. Check eligibility at pmkisan.gov.in.',
  '🔍 Early morning field inspection helps catch pest infestations before they spread rapidly.',
  '📊 Soil testing every 2-3 years ensures optimal fertilizer use and improves yields by 20-30%.'
];

// POST /api/chat
// body: { messages: [{role:'user'|'assistant', content: '...'}], model?: string }
app.post('/api/chat', async (req, res) => {
  console.log('>>> /api/chat called, body keys:', Object.keys(req.body));
  const { messages, model } = req.body;
  if (!messages) return res.status(400).json({ error: 'Missing messages array in body' });

  try {
    // Try real providers if configured
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const googleKey = process.env.VITE_GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    const hfKey = process.env.HF_API_KEY; // Hugging Face free tier
    console.log('proxy env -> HF key present?', !!hfKey);

    // Hugging Face inference first if key provided
    if (hfKey) {
      console.log('calling HF chat completions...');
      try {
        const modelName = process.env.HF_MODEL || 'mistralai/Mistral-7B-Instruct-v0.3';
        const hfUrl = `https://api-inference.huggingface.co/models/${modelName}/v1/chat/completions`;
        console.log('HF URL:', hfUrl);
        const hfRes = await fetch(hfUrl, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: modelName,
            messages: messages,
            max_tokens: 1024,
            stream: false
          })
        });
        const hfData = await hfRes.json();
        console.log('HF response status:', hfRes.status);
        try {
          console.log('HF response body preview:', JSON.stringify(hfData).slice(0, 500));
        } catch (e) {
          console.log('HF response body could not be stringified');
        }
        if (!hfRes.ok) {
          console.error('HF error response:', hfData);
          throw new Error(hfData?.error?.message || `HF returned ${hfRes.status}`);
        }
        const text = hfData?.choices?.[0]?.message?.content || '';
        return res.status(200).json({ text, raw: hfData });
      } catch (e) {
        console.error('HF call failed', e.message);
        // fall through to other providers or mock
      }
    }

    if (anthropicKey) {
      // Call Anthropic
      const providerRes = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey
        },
        body: JSON.stringify({ model: model || 'claude-sonnet-4-20250514', messages, max_tokens: 1000 })
      });
      const data = await providerRes.text();
      return res.status(providerRes.status).send(data);
    }

    if (googleKey) {
      // Try Google Generative API (requires properly configured key + enabled API)
      try {
        const promptText = messages.map(m => `${m.role}: ${m.content}`).join('\n\n');
        const url = `https://generativelanguage.googleapis.com/v1beta2/models/gemini-pro:generateContent?key=${googleKey}`;
        const providerRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
            temperature: 0.2,
            generationConfig: { maxOutputTokens: 512 }
          })
        });

        if (providerRes.ok) {
          const data = await providerRes.json();
          let outText = '';
          if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
            outText = data.candidates[0].content.parts.map(p => p.text).join('');
          }
          if (outText) return res.status(200).json({ text: outText, raw: data });
        }
      } catch (e) {
        console.log('Gemini API call failed, using mock fallback:', e.message);
      }
    }

    // Default: Return mock response (demo mode)
    const randomMock = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    return res.status(200).json({
      text: randomMock,
      raw: { mock: true, message: 'Demo mode: using mock response' }
    });
  } catch (err) {
    console.error('Proxy error', err);
    res.status(500).json({ error: err.message });
  }
});

// some Windows users find 5174 already taken (Vite uses 5173, other tools
// sometimes grab nearby ports). make it easy to override via env, but
// default to 5176 which seems reliable on this machine.
const port = process.env.PORT || 5176;
app.listen(port, () => console.log('🌾 KrishiConnect proxy listening on port', port));
