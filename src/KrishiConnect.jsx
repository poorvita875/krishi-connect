import { useState, useRef, useEffect } from "react";

// ── GROQ API ───────────────────────────────────────────────────────────────
const GROQ_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant";

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────
const T = {
  en: {
    appName: "KrishiConnect AI",
    appSub: "Smart Farming Assistant",
    // Nav
    home: "Home", chat: "AI Chat", pest: "Pest", weather: "Weather", schemes: "Schemes",
    // Home
    heroTitle1: "When Farmers", heroTitleHighlight: "Talk,", heroTitle2: "Technology Listens",
    heroSub: "Your AI-powered agricultural companion — available 24/7 in your language",
    heroBadge: "Karnataka Pilot • Expanding Pan-India",
    quickAccess: "Quick Access",
    qaChat: "AI Assistant", qaChatDesc: "Ask about crops, pests, farming tips",
    qaPest: "Pest Detection", qaPestDesc: "Upload photo for instant diagnosis",
    qaWeather: "Weather", qaWeatherDesc: "Hyperlocal alerts for your district",
    qaSchemes: "Govt Schemes", qaSchemesDesc: "Find subsidies & apply online",
    farmersEmpowered: "Farmers to be Empowered",
    languagesSupported: "Languages Supported",
    fasterInfo: "Faster Info Access",
    dailyTip: "Daily Farming Tip",
    featuredScheme: "Featured Scheme",
    centralGovt: "Central Government",
    viewDetails: "View details & apply →",
    startingKarnataka: "Starting in Karnataka, scaling across India within 18 months.",
    // Chat
    online: "Online",
    agriExpert: "Agricultural Expert",
    askPlaceholder: "Ask about crops, schemes, weather...",
    chatWelcome: "🙏 Namaskara! I'm KrishiConnect AI, your farming assistant.\n\nI can help you with:\n🌾 Crop diseases & treatments\n💰 Government schemes\n🌤️ Weather-based advice\n📈 Market prices\n\nWhat can I help you with today?",
    suggestions: ["What fertilizer for rice?", "Signs of pest attack?", "PM-KISAN eligibility", "Best time to sow wheat"],
    // Pest
    pestTitle: "Pest & Disease Detection",
    pestSub: "Upload a photo of your crop's leaves or stems. Our AI will identify the disease and recommend treatment.",
    tapUpload: "Tap to upload crop photo",
    uploadSub: "Or drag and drop an image here\nSupports JPG, PNG, WEBP",
    analyzeBtn: "Analyze Crop Disease",
    analyzing: "Analyzing…",
    analysisResult: "Analysis Result",
    tipsTitle: "Tips for Best Results",
    tip1Title: "Good Lighting", tip1: "Take photos in natural daylight for accurate color detection",
    tip2Title: "Close-up Shot", tip2: "Focus on the affected area — fill 80% of frame",
    tip3Title: "Multiple Angles", tip3: "Try top view and underside of leaf for better diagnosis",
    tip4Title: "Early Detection", tip4: "Upload at first signs of discoloration or damage",
    // Weather
    liveTag: "LIVE",
    fetchingWeather: "Fetching live weather…",
    fetchingSub: "Getting real-time data for",
    connectionError: "Connection Error",
    checkConnection: "Unable to fetch live weather. Please check your internet connection.",
    retry: "Retry",
    farmingAdvisory: "Farming Advisory",
    dayForecast: "7-Day Forecast",
    cropAlerts: "Crop Alerts",
    humidity: "Humidity", rainfall: "Rainfall", wind: "Wind km/h",
    rainAlert: "Rain Alert", rainAlertDesc: "Significant rainfall. Avoid pesticide spraying. Clear field drainage channels immediately.",
    goodConditions: "Good Conditions", goodConditionsDesc: "Weather suitable for field operations today.",
    heatAlert: "Heat Stress Alert", heatAlertDesc: "Temperature above 35°C. Monitor crops for heat stress. Increase irrigation frequency.",
    fungalRisk: "Fungal Risk", fungalRiskDesc: "High humidity. Watch for fungal diseases. Consider preventive fungicide.",
    dailyTipAlert: "Daily Tip", dailyTipAlertDesc: "Best time for field work: 6–9 AM and 4–6 PM to avoid peak heat.",
    today: "Today",
    // Schemes
    schemesFound: "schemes found",
    schemeFound: "scheme found",
    searchPlaceholder: "Search schemes...",
    viewDetailsApply: "▼ View details & apply",
    hideDetails: "▲ Less info",
    eligibility: "Eligibility", deadline: "Deadline", howToApply: "How to Apply",
    applyNow: "Apply Now / Learn More",
    // Farm advice
    adviceHeavyRain: "🌧️ Heavy rain expected — postpone spraying operations and check field drainage. Protect harvested produce from moisture.",
    adviceLightRain: "🌦️ Light rain ahead — good time for transplanting and fertilizer application after the shower passes.",
    adviceExtremeHeat: "🌡️ Extreme heat — increase irrigation frequency. Morning watering recommended. Protect young seedlings with shade nets.",
    adviceHot: "☀️ Hot and dry — ideal for harvesting and threshing. Ensure adequate irrigation every 2-3 days.",
    adviceGood: "🌿 Comfortable conditions — good for most field operations including sowing, weeding, and crop monitoring.",
    // Filter categories
    all: "All", incomeSupport: "Income Support", cropInsurance: "Crop Insurance",
    agriCredit: "Agricultural Credit", irrigation: "Irrigation", stateSupport: "State Support",
    marketAccess: "Market Access", farmAdvisory: "Farm Advisory", infrastructure: "Infrastructure",
  },
  kn: {
    appName: "ಕೃಷಿ ಕನೆಕ್ಟ್ AI",
    appSub: "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ಸಹಾಯಕ",
    home: "ಮುಖ್ಯ", chat: "AI ಚಾಟ್", pest: "ಕೀಟ", weather: "ಹವಾಮಾನ", schemes: "ಯೋಜನೆ",
    heroTitle1: "ರೈತರು", heroTitleHighlight: "ಮಾತನಾಡಿದಾಗ,", heroTitle2: "ತಂತ್ರಜ್ಞಾನ ಆಲಿಸುತ್ತದೆ",
    heroSub: "ನಿಮ್ಮ AI-ಚಾಲಿತ ಕೃಷಿ ಸಹಾಯಕ — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ 24/7 ಲಭ್ಯ",
    heroBadge: "ಕರ್ನಾಟಕ ಪೈಲಟ್ • ಭಾರತಾದ್ಯಂತ ವಿಸ್ತರಣೆ",
    quickAccess: "ತ್ವರಿತ ಪ್ರವೇಶ",
    qaChat: "AI ಸಹಾಯಕ", qaChatDesc: "ಬೆಳೆ, ಕೀಟ, ಕೃಷಿ ಸಲಹೆ ಕೇಳಿ",
    qaPest: "ಕೀಟ ಪತ್ತೆ", qaPestDesc: "ತಕ್ಷಣ ರೋಗ ನಿರ್ಣಯಕ್ಕೆ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    qaWeather: "ಹವಾಮಾನ", qaWeatherDesc: "ನಿಮ್ಮ ಜಿಲ್ಲೆಗೆ ಸ್ಥಳೀಯ ಎಚ್ಚರಿಕೆ",
    qaSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆ", qaSchemesDesc: "ಸಬ್ಸಿಡಿ ಹುಡುಕಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    farmersEmpowered: "ರೈತರಿಗೆ ಸಹಾಯ",
    languagesSupported: "ಭಾಷೆಗಳು ಬೆಂಬಲಿತ",
    fasterInfo: "ವೇಗದ ಮಾಹಿತಿ",
    dailyTip: "ದೈನಂದಿನ ಕೃಷಿ ಸಲಹೆ",
    featuredScheme: "ಪ್ರಮುಖ ಯೋಜನೆ",
    centralGovt: "ಕೇಂದ್ರ ಸರ್ಕಾರ",
    viewDetails: "ವಿವರ ನೋಡಿ ಮತ್ತು ಅರ್ಜಿ ಸಲ್ಲಿಸಿ →",
    startingKarnataka: "ಕರ್ನಾಟಕದಲ್ಲಿ ಪ್ರಾರಂಭ, 18 ತಿಂಗಳಲ್ಲಿ ಭಾರತಾದ್ಯಂತ.",
    online: "ಆನ್‌ಲೈನ್", agriExpert: "ಕೃಷಿ ತಜ್ಞ",
    askPlaceholder: "ಬೆಳೆ, ಯೋಜನೆ, ಹವಾಮಾನ ಬಗ್ಗೆ ಕೇಳಿ...",
    chatWelcome: "🙏 ನಮಸ್ಕಾರ! ನಾನು KrishiConnect AI, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ.\n\nನಾನು ಸಹಾಯ ಮಾಡಬಲ್ಲೆ:\n🌾 ಬೆಳೆ ರೋಗ ಮತ್ತು ಚಿಕಿತ್ಸೆ\n💰 ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು\n🌤️ ಹವಾಮಾನ ಆಧಾರಿತ ಸಲಹೆ\n📈 ಮಾರುಕಟ್ಟೆ ಬೆಲೆ\n\nಇಂದು ನಾನು ಏನು ಸಹಾಯ ಮಾಡಲಿ?",
    suggestions: ["ಭತ್ತಕ್ಕೆ ಯಾವ ಗೊಬ್ಬರ?", "ಕೀಟ ದಾಳಿ ಚಿಹ್ನೆಗಳು?", "PM-KISAN ಅರ್ಹತೆ", "ಗೋಧಿ ಬಿತ್ತಲು ಸಮಯ"],
    pestTitle: "ಕೀಟ ಮತ್ತು ರೋಗ ಪತ್ತೆ",
    pestSub: "ನಿಮ್ಮ ಬೆಳೆಯ ಎಲೆ ಅಥವಾ ಕಾಂಡದ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ. ನಮ್ಮ AI ರೋಗ ಗುರುತಿಸಿ ಚಿಕಿತ್ಸೆ ಸೂಚಿಸುತ್ತದೆ.",
    tapUpload: "ಬೆಳೆ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಲು ಒತ್ತಿ",
    uploadSub: "ಅಥವಾ ಇಲ್ಲಿ ಡ್ರ್ಯಾಗ್ ಮಾಡಿ\nJPG, PNG, WEBP ಬೆಂಬಲಿತ",
    analyzeBtn: "ಬೆಳೆ ರೋಗ ವಿಶ್ಲೇಷಿಸಿ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ…",
    analysisResult: "ವಿಶ್ಲೇಷಣೆ ಫಲಿತಾಂಶ",
    tipsTitle: "ಉತ್ತಮ ಫಲಿತಾಂಶಕ್ಕಾಗಿ ಸಲಹೆ",
    tip1Title: "ಉತ್ತಮ ಬೆಳಕು", tip1: "ನಿಖರ ಬಣ್ಣ ಪತ್ತೆಗಾಗಿ ನೈಸರ್ಗಿಕ ಬೆಳಕಿನಲ್ಲಿ ಫೋಟೋ ತೆಗೆಯಿರಿ",
    tip2Title: "ಹತ್ತಿರದ ಚಿತ್ರ", tip2: "ಪ್ರಭಾವಿತ ಭಾಗದ ಮೇಲೆ ಕೇಂದ್ರೀಕರಿಸಿ",
    tip3Title: "ಹಲವು ಕೋನಗಳು", tip3: "ಎಲೆಯ ಮೇಲ್ಭಾಗ ಮತ್ತು ಕೆಳಭಾಗ ಎರಡನ್ನೂ ತೆಗೆಯಿರಿ",
    tip4Title: "ಮೊದಲ ಹಂತದಲ್ಲಿ ಪತ್ತೆ", tip4: "ಬಣ್ಣ ಬದಲಾದ ತಕ್ಷಣ ಫೋಟೋ ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    liveTag: "ನೇರ", fetchingWeather: "ನೇರ ಹವಾಮಾನ ತರಲಾಗುತ್ತಿದೆ…",
    fetchingSub: "ನೇರ ಡೇಟಾ ತರಲಾಗುತ್ತಿದೆ:",
    connectionError: "ಸಂಪರ್ಕ ದೋಷ", checkConnection: "ಹವಾಮಾನ ಲೋಡ್ ಆಗಲಿಲ್ಲ. ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಪರೀಕ್ಷಿಸಿ.",
    retry: "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
    farmingAdvisory: "🌾 ಕೃಷಿ ಸಲಹೆ", dayForecast: "7-ದಿನ ಮುನ್ಸೂಚನೆ", cropAlerts: "ಬೆಳೆ ಎಚ್ಚರಿಕೆ",
    humidity: "ಆರ್ದ್ರತೆ", rainfall: "ಮಳೆ", wind: "ಗಾಳಿ km/h",
    rainAlert: "ಮಳೆ ಎಚ್ಚರಿಕೆ", rainAlertDesc: "ಭಾರೀ ಮಳೆ. ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಬೇಡಿ. ಹೊಲದ ಚರಂಡಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.",
    goodConditions: "ಉತ್ತಮ ಸ್ಥಿತಿ", goodConditionsDesc: "ಇಂದು ಹೊಲದ ಕೆಲಸಕ್ಕೆ ಹವಾಮಾನ ಸೂಕ್ತ.",
    heatAlert: "ಶಾಖ ಒತ್ತಡ ಎಚ್ಚರಿಕೆ", heatAlertDesc: "ತಾಪಮಾನ 35°C ಮೇಲಿದೆ. ನೀರಾವರಿ ಹೆಚ್ಚಿಸಿ.",
    fungalRisk: "ಶಿಲೀಂಧ್ರ ಅಪಾಯ", fungalRiskDesc: "ಹೆಚ್ಚಿನ ಆರ್ದ್ರತೆ. ಶಿಲೀಂಧ್ರ ರೋಗ ಗಮನಿಸಿ.",
    dailyTipAlert: "ದೈನಂದಿನ ಸಲಹೆ", dailyTipAlertDesc: "ಹೊಲದ ಕೆಲಸಕ್ಕೆ ಉತ್ತಮ ಸಮಯ: ಬೆಳಗ್ಗೆ 6–9 ಮತ್ತು ಸಂಜೆ 4–6.",
    today: "ಇಂದು",
    schemesFound: "ಯೋಜನೆಗಳು ಕಂಡಿವೆ", schemeFound: "ಯೋಜನೆ ಕಂಡಿದೆ",
    searchPlaceholder: "ಯೋಜನೆ ಹುಡುಕಿ...",
    viewDetailsApply: "▼ ವಿವರ ನೋಡಿ ಮತ್ತು ಅರ್ಜಿ", hideDetails: "▲ ಕಡಿಮೆ ಮಾಹಿತಿ",
    eligibility: "ಅರ್ಹತೆ", deadline: "ಗಡುವು", howToApply: "ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ",
    applyNow: "ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ",
    adviceHeavyRain: "🌧️ ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷಿತ — ಸಿಂಪಡಿಸುವ ಕೆಲಸ ಮುಂದೂಡಿ. ಚರಂಡಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ.",
    adviceLightRain: "🌦️ ಹಗುರ ಮಳೆ — ಮಳೆ ನಂತರ ಕಸಿ ಮತ್ತು ಗೊಬ್ಬರ ಹಾಕಲು ಉತ್ತಮ ಸಮಯ.",
    adviceExtremeHeat: "🌡️ ತೀವ್ರ ಬಿಸಿಲು — ನೀರಾವರಿ ಹೆಚ್ಚಿಸಿ. ಬೆಳಿಗ್ಗೆ ನೀರು ಹಾಕಿ.",
    adviceHot: "☀️ ಬಿಸಿ ಮತ್ತು ಒಣ — ಕೊಯ್ಲು ಮತ್ತು ಒಕ್ಕಣೆಗೆ ಸೂಕ್ತ.",
    adviceGood: "🌿 ಆರಾಮದಾಯಕ ವಾತಾವರಣ — ಬಿತ್ತನೆ, ಕಳೆ ತೆಗೆಯುವ ಕೆಲಸಕ್ಕೆ ಉತ್ತಮ.",
    all: "ಎಲ್ಲಾ", incomeSupport: "ಆದಾಯ ಬೆಂಬಲ", cropInsurance: "ಬೆಳೆ ವಿಮೆ",
    agriCredit: "ಕೃಷಿ ಸಾಲ", irrigation: "ನೀರಾವರಿ", stateSupport: "ರಾಜ್ಯ ಬೆಂಬಲ",
    marketAccess: "ಮಾರುಕಟ್ಟೆ", farmAdvisory: "ಕೃಷಿ ಸಲಹೆ", infrastructure: "ಮೂಲಸೌಕರ್ಯ",
  },
  hi: {
    appName: "कृषि कनेक्ट AI",
    appSub: "स्मार्ट कृषि सहायक",
    home: "होम", chat: "AI चैट", pest: "कीट", weather: "मौसम", schemes: "योजनाएं",
    heroTitle1: "जब किसान", heroTitleHighlight: "बोलते हैं,", heroTitle2: "तकनीक सुनती है",
    heroSub: "आपका AI-संचालित कृषि सहायक — आपकी भाषा में 24/7 उपलब्ध",
    heroBadge: "कर्नाटक पायलट • पूरे भारत में विस्तार",
    quickAccess: "त्वरित पहुंच",
    qaChat: "AI सहायक", qaChatDesc: "फसल, कीट, खेती की सलाह लें",
    qaPest: "कीट पहचान", qaPestDesc: "तुरंत निदान के लिए फोटो अपलोड करें",
    qaWeather: "मौसम", qaWeatherDesc: "आपके जिले के लिए स्थानीय अलर्ट",
    qaSchemes: "सरकारी योजनाएं", qaSchemesDesc: "सब्सिडी खोजें और आवेदन करें",
    farmersEmpowered: "किसानों को सशक्त बनाना",
    languagesSupported: "भाषाएं समर्थित",
    fasterInfo: "तेज़ जानकारी",
    dailyTip: "दैनिक कृषि टिप",
    featuredScheme: "विशेष योजना",
    centralGovt: "केंद्र सरकार",
    viewDetails: "विवरण देखें और आवेदन करें →",
    startingKarnataka: "कर्नाटक से शुरू, 18 महीनों में पूरे भारत में।",
    online: "ऑनलाइन", agriExpert: "कृषि विशेषज्ञ",
    askPlaceholder: "फसल, योजनाएं, मौसम के बारे में पूछें...",
    chatWelcome: "🙏 नमस्ते! मैं KrishiConnect AI हूं, आपका कृषि सहायक।\n\nमैं मदद कर सकता हूं:\n🌾 फसल रोग और उपचार\n💰 सरकारी योजनाएं\n🌤️ मौसम आधारित सलाह\n📈 बाज़ार के भाव\n\nआज मैं आपकी क्या मदद करूं?",
    suggestions: ["धान के लिए खाद?", "कीट हमले के संकेत?", "PM-KISAN पात्रता", "गेहूं बोने का समय"],
    pestTitle: "कीट और रोग पहचान",
    pestSub: "अपनी फसल की पत्तियों या तने की फोटो अपलोड करें। हमारा AI रोग पहचानकर उपचार सुझाएगा।",
    tapUpload: "फसल की फोटो अपलोड करें",
    uploadSub: "या यहां खींचें और छोड़ें\nJPG, PNG, WEBP समर्थित",
    analyzeBtn: "फसल रोग विश्लेषण करें",
    analyzing: "विश्लेषण हो रहा है…",
    analysisResult: "विश्लेषण परिणाम",
    tipsTitle: "बेहतर परिणाम के लिए सुझाव",
    tip1Title: "अच्छी रोशनी", tip1: "सटीक रंग पहचान के लिए प्राकृतिक प्रकाश में फोटो लें",
    tip2Title: "नज़दीकी शॉट", tip2: "प्रभावित क्षेत्र पर फोकस करें — 80% फ्रेम भरें",
    tip3Title: "अनेक कोण", tip3: "पत्ती के ऊपर और नीचे दोनों की फोटो लें",
    tip4Title: "शीघ्र पहचान", tip4: "रंग बदलते ही फोटो अपलोड करें",
    liveTag: "लाइव", fetchingWeather: "लाइव मौसम डेटा लोड हो रहा है…",
    fetchingSub: "रीयल-टाइम डेटा लाया जा रहा है:",
    connectionError: "कनेक्शन त्रुटि", checkConnection: "मौसम लोड नहीं हो सका। इंटरनेट जांचें।",
    retry: "पुनः प्रयास करें",
    farmingAdvisory: "🌾 कृषि सलाह", dayForecast: "7-दिन पूर्वानुमान", cropAlerts: "फसल अलर्ट",
    humidity: "आर्द्रता", rainfall: "वर्षा", wind: "हवा km/h",
    rainAlert: "वर्षा अलर्ट", rainAlertDesc: "भारी वर्षा। कीटनाशक छिड़काव न करें। खेत की नाली साफ करें।",
    goodConditions: "अच्छी स्थिति", goodConditionsDesc: "आज खेत के काम के लिए मौसम उपयुक्त।",
    heatAlert: "गर्मी तनाव अलर्ट", heatAlertDesc: "तापमान 35°C से ऊपर। सिंचाई बढ़ाएं।",
    fungalRisk: "फफूंद जोखिम", fungalRiskDesc: "उच्च आर्द्रता। फफूंद रोगों के लिए सतर्क रहें।",
    dailyTipAlert: "दैनिक टिप", dailyTipAlertDesc: "खेत काम का सबसे अच्छा समय: सुबह 6–9 और शाम 4–6 बजे।",
    today: "आज",
    schemesFound: "योजनाएं मिलीं", schemeFound: "योजना मिली",
    searchPlaceholder: "योजनाएं खोजें...",
    viewDetailsApply: "▼ विवरण और आवेदन", hideDetails: "▲ कम जानकारी",
    eligibility: "पात्रता", deadline: "अंतिम तिथि", howToApply: "आवेदन कैसे करें",
    applyNow: "अभी आवेदन करें",
    adviceHeavyRain: "🌧️ भारी वर्षा — छिड़काव रोकें। खेत की नाली साफ करें।",
    adviceLightRain: "🌦️ हल्की बारिश — बारिश के बाद रोपाई और खाद डालने का अच्छा समय।",
    adviceExtremeHeat: "🌡️ अत्यधिक गर्मी — सिंचाई बढ़ाएं। सुबह पानी दें।",
    adviceHot: "☀️ गर्म और शुष्क — कटाई और मड़ाई के लिए उपयुक्त।",
    adviceGood: "🌿 आरामदायक मौसम — बुवाई, निराई के लिए उत्तम।",
    all: "सभी", incomeSupport: "आय सहायता", cropInsurance: "फसल बीमा",
    agriCredit: "कृषि ऋण", irrigation: "सिंचाई", stateSupport: "राज्य सहायता",
    marketAccess: "बाज़ार पहुंच", farmAdvisory: "कृषि सलाह", infrastructure: "बुनियादी ढांचा",
  },
  ta: {
    appName: "கிருஷி கனெக்ட் AI",
    appSub: "ஸ்மார்ட் விவசாய உதவியாளர்",
    home: "முகப்பு", chat: "AI அரட்டை", pest: "பூச்சி", weather: "வானிலை", schemes: "திட்டங்கள்",
    heroTitle1: "விவசாயிகள்", heroTitleHighlight: "பேசும்போது,", heroTitle2: "தொழில்நுட்பம் கேட்கிறது",
    heroSub: "உங்கள் AI-இயக்கும் விவசாய உதவியாளர் — உங்கள் மொழியில் 24/7 கிடைக்கும்",
    heroBadge: "கர்நாடக பைலட் • இந்தியா முழுவதும் விரிவாக்கம்",
    quickAccess: "விரைவு அணுகல்",
    qaChat: "AI உதவியாளர்", qaChatDesc: "பயிர், பூச்சி, விவசாய ஆலோசனை கேளுங்கள்",
    qaPest: "பூச்சி கண்டறிதல்", qaPestDesc: "உடனடி நோயறிதலுக்கு புகைப்படம் பதிவேற்றுங்கள்",
    qaWeather: "வானிலை", qaWeatherDesc: "உங்கள் மாவட்டத்திற்கான உள்ளூர் எச்சரிக்கை",
    qaSchemes: "அரசு திட்டங்கள்", qaSchemesDesc: "மானியங்கள் தேடி விண்ணப்பிக்கவும்",
    farmersEmpowered: "விவசாயிகள் மேம்பாடு",
    languagesSupported: "மொழிகள் ஆதரவு",
    fasterInfo: "வேகமான தகவல்",
    dailyTip: "தினசரி விவசாய குறிப்பு",
    featuredScheme: "சிறப்பு திட்டம்",
    centralGovt: "மத்திய அரசு",
    viewDetails: "விவரங்கள் காண்க மற்றும் விண்ணப்பிக்கவும் →",
    startingKarnataka: "கர்நாடகாவில் தொடங்கி, 18 மாதங்களில் இந்தியா முழுவதும்.",
    online: "ஆன்லைன்", agriExpert: "விவசாய நிபுணர்",
    askPlaceholder: "பயிர், திட்டங்கள், வானிலை பற்றி கேளுங்கள்...",
    chatWelcome: "🙏 வணக்கம்! நான் KrishiConnect AI, உங்கள் விவசாய உதவியாளர்.\n\nநான் உதவலாம்:\n🌾 பயிர் நோய்கள் & சிகிச்சை\n💰 அரசு திட்டங்கள்\n🌤️ வானிலை அடிப்படை ஆலோசனை\n📈 சந்தை விலைகள்\n\nஇன்று நான் எப்படி உதவலாம்?",
    suggestions: ["நெல்லுக்கு உரம்?", "பூச்சி தாக்குதல் அறிகுறிகள்?", "PM-KISAN தகுதி", "கோதுமை விதைக்கும் நேரம்"],
    pestTitle: "பூச்சி மற்றும் நோய் கண்டறிதல்",
    pestSub: "உங்கள் பயிரின் இலை அல்லது தண்டின் புகைப்படத்தை பதிவேற்றுங்கள். எங்கள் AI நோயை அடையாளம் கண்டு சிகிச்சை பரிந்துரைக்கும்.",
    tapUpload: "பயிர் புகைப்படம் பதிவேற்ற தட்டவும்",
    uploadSub: "அல்லது இங்கே இழுத்து விடுங்கள்\nJPG, PNG, WEBP ஆதரவு",
    analyzeBtn: "பயிர் நோய் பகுப்பாய்வு",
    analyzing: "பகுப்பாய்வு செய்கிறோம்…",
    analysisResult: "பகுப்பாய்வு முடிவு",
    tipsTitle: "சிறந்த முடிவுகளுக்கான குறிப்புகள்",
    tip1Title: "நல்ல வெளிச்சம்", tip1: "சரியான வண்ண கண்டறிதலுக்கு இயற்கை வெளிச்சத்தில் எடுக்கவும்",
    tip2Title: "அருகிலிருந்து எடுக்கவும்", tip2: "பாதிக்கப்பட்ட பகுதியில் கவனம் செலுத்துங்கள்",
    tip3Title: "பல கோணங்கள்", tip3: "இலையின் மேல் மற்றும் கீழ் பகுதி எடுக்கவும்",
    tip4Title: "ஆரம்ப கண்டறிதல்", tip4: "நிறம் மாறும்போதே புகைப்படம் பதிவேற்றுங்கள்",
    liveTag: "நேரலை", fetchingWeather: "நேரலை வானிலை தரவு ஏற்றுகிறோம்…",
    fetchingSub: "நேரடி தரவு கொண்டு வருகிறோம்:",
    connectionError: "இணைப்பு பிழை", checkConnection: "வானிலை ஏற்றமுடியவில்லை. இணையம் சரிபாருங்கள்.",
    retry: "மீண்டும் முயலவும்",
    farmingAdvisory: "🌾 விவசாய ஆலோசனை", dayForecast: "7-நாள் முன்னறிவிப்பு", cropAlerts: "பயிர் எச்சரிக்கை",
    humidity: "ஈரப்பதம்", rainfall: "மழை", wind: "காற்று km/h",
    rainAlert: "மழை எச்சரிக்கை", rainAlertDesc: "அதிக மழை. பூச்சிக்கொல்லி தெளிக்க வேண்டாம். வயல் வடிகால் சுத்தம் செய்யுங்கள்.",
    goodConditions: "நல்ல நிலை", goodConditionsDesc: "இன்று வயல் பணிக்கு வானிலை சாதகமாக உள்ளது.",
    heatAlert: "வெப்ப அழுத்த எச்சரிக்கை", heatAlertDesc: "வெப்பநிலை 35°C க்கு மேல். நீர்ப்பாசனம் அதிகரிக்கவும்.",
    fungalRisk: "பூஞ்சை ஆபத்து", fungalRiskDesc: "அதிக ஈரப்பதம். பூஞ்சை நோய்களை கவனியுங்கள்.",
    dailyTipAlert: "தினசரி குறிப்பு", dailyTipAlertDesc: "வயல் பணிக்கு சிறந்த நேரம்: காலை 6–9 மற்றும் மாலை 4–6.",
    today: "இன்று",
    schemesFound: "திட்டங்கள் கண்டறியப்பட்டன", schemeFound: "திட்டம் கண்டறியப்பட்டது",
    searchPlaceholder: "திட்டங்கள் தேடுங்கள்...",
    viewDetailsApply: "▼ விவரங்கள் மற்றும் விண்ணப்பம்", hideDetails: "▲ குறைவான தகவல்",
    eligibility: "தகுதி", deadline: "கடைசி தேதி", howToApply: "விண்ணப்பிப்பது எப்படி",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    adviceHeavyRain: "🌧️ கனமழை எதிர்பார்க்கப்படுகிறது — தெளிப்பு நிறுத்துங்கள். வடிகால் சுத்தம் செய்யுங்கள்.",
    adviceLightRain: "🌦️ இலேசான மழை — மழைக்கு பிறகு நடவு மற்றும் உரமிட சிறந்த நேரம்.",
    adviceExtremeHeat: "🌡️ கடும் வெப்பம் — நீர்ப்பாசனம் அதிகரிக்கவும். காலையில் தண்ணீர் கொடுக்கவும்.",
    adviceHot: "☀️ வெப்பமான மற்றும் வறண்ட — அறுவடை மற்றும் போரடிக்கு சிறந்தது.",
    adviceGood: "🌿 வசதியான தட்பவெப்பநிலை — விதைப்பு, களை எடுக்க சிறந்தது.",
    all: "அனைத்தும்", incomeSupport: "வருமான ஆதரவு", cropInsurance: "பயிர் காப்பீடு",
    agriCredit: "வேளாண் கடன்", irrigation: "நீர்ப்பாசனம்", stateSupport: "மாநில ஆதரவு",
    marketAccess: "சந்தை அணுகல்", farmAdvisory: "வேளாண் ஆலோசனை", infrastructure: "உள்கட்டமைப்பு",
  },
  te: {
    appName: "కృషి కనెక్ట్ AI",
    appSub: "స్మార్ట్ వ్యవసాయ సహాయకుడు",
    home: "హోమ్", chat: "AI చాట్", pest: "పురుగు", weather: "వాతావరణం", schemes: "పథకాలు",
    heroTitle1: "రైతులు", heroTitleHighlight: "మాట్లాడినప్పుడు,", heroTitle2: "సాంకేతికత వింటుంది",
    heroSub: "మీ AI-ఆధారిత వ్యవసాయ సహాయకుడు — మీ భాషలో 24/7 అందుబాటులో",
    heroBadge: "కర్నాటక పైలట్ • భారతదేశం అంతటా విస్తరణ",
    quickAccess: "త్వరిత యాక్సెస్",
    qaChat: "AI సహాయకుడు", qaChatDesc: "పంట, పురుగు, వ్యవసాయ చిట్కాలు అడగండి",
    qaPest: "పురుగు గుర్తింపు", qaPestDesc: "తక్షణ నిర్ధారణకు ఫోటో అప్‌లోడ్ చేయండి",
    qaWeather: "వాతావరణం", qaWeatherDesc: "మీ జిల్లాకు స్థానిక హెచ్చరికలు",
    qaSchemes: "ప్రభుత్వ పథకాలు", qaSchemesDesc: "సబ్సిడీలు కనుగొని దరఖాస్తు చేయండి",
    farmersEmpowered: "రైతులకు శక్తి",
    languagesSupported: "భాషలు మద్దతు",
    fasterInfo: "వేగవంతమైన సమాచారం",
    dailyTip: "రోజువారీ వ్యవసాయ చిట్కా",
    featuredScheme: "ప్రత్యేక పథకం",
    centralGovt: "కేంద్ర ప్రభుత్వం",
    viewDetails: "వివరాలు చూసి దరఖాస్తు చేయండి →",
    startingKarnataka: "కర్నాటకలో ప్రారంభించి, 18 నెలల్లో భారతదేశం అంతటా.",
    online: "ఆన్‌లైన్", agriExpert: "వ్యవసాయ నిపుణుడు",
    askPlaceholder: "పంట, పథకాలు, వాతావరణం గురించి అడగండి...",
    chatWelcome: "🙏 నమస్కారం! నేను KrishiConnect AI, మీ వ్యవసాయ సహాయకుడిని.\n\nనేను సహాయపడగలను:\n🌾 పంట వ్యాధులు & చికిత్స\n💰 ప్రభుత్వ పథకాలు\n🌤️ వాతావరణ ఆధారిత సలహా\n📈 మార్కెట్ ధరలు\n\nఈరోజు మీకు ఏం సహాయం చేయాలి?",
    suggestions: ["వరికి ఎరువు?", "పురుగు దాడి సంకేతాలు?", "PM-KISAN అర్హత", "గోధుమ విత్తు సమయం"],
    pestTitle: "పురుగు మరియు వ్యాధి గుర్తింపు",
    pestSub: "మీ పంట ఆకులు లేదా కాండం ఫోటో అప్‌లోడ్ చేయండి. మా AI వ్యాధిని గుర్తించి చికిత్స సూచిస్తుంది.",
    tapUpload: "పంట ఫోటో అప్‌లోడ్ చేయడానికి నొక్కండి",
    uploadSub: "లేదా ఇక్కడ డ్రాగ్ చేయండి\nJPG, PNG, WEBP మద్దతు",
    analyzeBtn: "పంట వ్యాధి విశ్లేషించండి",
    analyzing: "విశ్లేషిస్తున్నాం…",
    analysisResult: "విశ్లేషణ ఫలితం",
    tipsTitle: "మెరుగైన ఫలితాలకు చిట్కాలు",
    tip1Title: "మంచి వెలుతురు", tip1: "ఖచ్చితమైన రంగు గుర్తింపుకు సహజ వెలుతురులో ఫోటో తీయండి",
    tip2Title: "దగ్గర షాట్", tip2: "ప్రభావిత ప్రాంతంపై దృష్టి పెట్టండి",
    tip3Title: "అనేక కోణాలు", tip3: "ఆకు పైభాగం మరియు అడుగు భాగం రెండూ తీయండి",
    tip4Title: "ముందస్తు గుర్తింపు", tip4: "రంగు మారిన వెంటనే ఫోటో అప్‌లోడ్ చేయండి",
    liveTag: "లైవ్", fetchingWeather: "లైవ్ వాతావరణ డేటా లోడ్ అవుతోంది…",
    fetchingSub: "నిజ-సమయ డేటా తీసుకొస్తున్నాం:",
    connectionError: "కనెక్షన్ లోపం", checkConnection: "వాతావరణం లోడ్ కాలేదు. ఇంటర్నెట్ తనిఖీ చేయండి.",
    retry: "మళ్ళీ ప్రయత్నించండి",
    farmingAdvisory: "🌾 వ్యవసాయ సలహా", dayForecast: "7-రోజుల అంచనా", cropAlerts: "పంట హెచ్చరికలు",
    humidity: "తేమ", rainfall: "వర్షపాతం", wind: "గాలి km/h",
    rainAlert: "వర్షపు హెచ్చరిక", rainAlertDesc: "భారీ వర్షం. పురుగుమందు పిచికారీ వద్దు. పొలం కాలువ శుభ్రం చేయండి.",
    goodConditions: "మంచి పరిస్థితులు", goodConditionsDesc: "ఈరోజు పొలం పని చేయడానికి వాతావరణం అనుకూలంగా ఉంది.",
    heatAlert: "వేడి ఒత్తిడి హెచ్చరిక", heatAlertDesc: "ఉష్ణోగ్రత 35°C పైన. నీటిపారుదల పెంచండి.",
    fungalRisk: "శిలీంధ్ర ప్రమాదం", fungalRiskDesc: "అధిక తేమ. శిలీంధ్ర వ్యాధులకు జాగ్రత్తగా ఉండండి.",
    dailyTipAlert: "రోజువారీ చిట్కా", dailyTipAlertDesc: "పొలం పని చేయడానికి ఉత్తమ సమయం: ఉదయం 6–9 మరియు సాయంత్రం 4–6.",
    today: "ఈరోజు",
    schemesFound: "పథకాలు కనుగొనబడ్డాయి", schemeFound: "పథకం కనుగొనబడింది",
    searchPlaceholder: "పథకాలు వెతకండి...",
    viewDetailsApply: "▼ వివరాలు మరియు దరఖాస్తు", hideDetails: "▲ తక్కువ సమాచారం",
    eligibility: "అర్హత", deadline: "చివరి తేది", howToApply: "దరఖాస్తు ఎలా చేయాలి",
    applyNow: "ఇప్పుడు దరఖాస్తు చేయండి",
    adviceHeavyRain: "🌧️ భారీ వర్షం — పిచికారీ నిలిపివేయండి. కాలువ శుభ్రం చేయండి.",
    adviceLightRain: "🌦️ తేలికపాటి వర్షం — వర్షం తర్వాత మొక్కలు నాటడానికి మంచి సమయం.",
    adviceExtremeHeat: "🌡️ తీవ్రమైన వేడి — నీటిపారుదల పెంచండి. ఉదయం నీళ్ళు పోయండి.",
    adviceHot: "☀️ వేడి మరియు పొడి — కోత మరియు నూర్పిడికి అనుకూలం.",
    adviceGood: "🌿 సౌకర్యవంతమైన వాతావరణం — విత్తనాలు, కలుపు తీయడానికి అనువైనది.",
    all: "అన్నీ", incomeSupport: "ఆదాయ మద్దతు", cropInsurance: "పంట బీమా",
    agriCredit: "వ్యవసాయ రుణం", irrigation: "నీటిపారుదల", stateSupport: "రాష్ట్ర మద్దతు",
    marketAccess: "మార్కెట్ యాక్సెస్", farmAdvisory: "వ్యవసాయ సలహా", infrastructure: "మౌలిక సదుపాయాలు",
  },
  mr: {
    appName: "कृषी कनेक्ट AI",
    appSub: "स्मार्ट शेती सहाय्यक",
    home: "मुखपृष्ठ", chat: "AI चॅट", pest: "कीड", weather: "हवामान", schemes: "योजना",
    heroTitle1: "शेतकरी", heroTitleHighlight: "बोलतात तेव्हा,", heroTitle2: "तंत्रज्ञान ऐकते",
    heroSub: "तुमचा AI-चालित शेती सहाय्यक — तुमच्या भाषेत 24/7 उपलब्ध",
    heroBadge: "कर्नाटक पायलट • संपूर्ण भारतात विस्तार",
    quickAccess: "जलद प्रवेश",
    qaChat: "AI सहाय्यक", qaChatDesc: "पीक, कीड, शेती टिप्स विचारा",
    qaPest: "कीड शोधणे", qaPestDesc: "त्वरित निदानासाठी फोटो अपलोड करा",
    qaWeather: "हवामान", qaWeatherDesc: "तुमच्या जिल्ह्यासाठी स्थानिक इशारे",
    qaSchemes: "सरकारी योजना", qaSchemesDesc: "अनुदाने शोधा आणि अर्ज करा",
    farmersEmpowered: "शेतकऱ्यांना सक्षम करणे",
    languagesSupported: "भाषा समर्थित",
    fasterInfo: "जलद माहिती",
    dailyTip: "दैनंदिन शेती टिप",
    featuredScheme: "विशेष योजना",
    centralGovt: "केंद्र सरकार",
    viewDetails: "तपशील पाहा आणि अर्ज करा →",
    startingKarnataka: "कर्नाटकात सुरुवात, 18 महिन्यांत संपूर्ण भारतात.",
    online: "ऑनलाइन", agriExpert: "कृषी तज्ञ",
    askPlaceholder: "पीक, योजना, हवामान याबद्दल विचारा...",
    chatWelcome: "🙏 नमस्कार! मी KrishiConnect AI आहे, तुमचा शेती सहाय्यक.\n\nमी मदत करू शकतो:\n🌾 पीक रोग आणि उपचार\n💰 सरकारी योजना\n🌤️ हवामान-आधारित सल्ला\n📈 बाजार भाव\n\nआज मी तुम्हाला काय मदत करू?",
    suggestions: ["भाताला कोणते खत?", "कीड हल्ल्याची लक्षणे?", "PM-KISAN पात्रता", "गहू पेरण्याची वेळ"],
    pestTitle: "कीड आणि रोग शोधणे",
    pestSub: "तुमच्या पिकाच्या पानांचा किंवा खोडाचा फोटो अपलोड करा. आमचे AI रोग ओळखून उपचार सुचवेल.",
    tapUpload: "पीक फोटो अपलोड करण्यासाठी टॅप करा",
    uploadSub: "किंवा येथे ड्रॅग करा\nJPG, PNG, WEBP समर्थित",
    analyzeBtn: "पीक रोग विश्लेषण करा",
    analyzing: "विश्लेषण होत आहे…",
    analysisResult: "विश्लेषण निकाल",
    tipsTitle: "चांगल्या निकालांसाठी टिप्स",
    tip1Title: "चांगला प्रकाश", tip1: "अचूक रंग शोधण्यासाठी नैसर्गिक प्रकाशात फोटो काढा",
    tip2Title: "जवळून शॉट", tip2: "प्रभावित भागावर लक्ष केंद्रित करा",
    tip3Title: "अनेक कोन", tip3: "पानाची वरची आणि खालची बाजू दोन्ही काढा",
    tip4Title: "लवकर शोध", tip4: "रंग बदलताच फोटो अपलोड करा",
    liveTag: "थेट", fetchingWeather: "थेट हवामान डेटा लोड होत आहे…",
    fetchingSub: "रिअल-टाइम डेटा आणत आहोत:",
    connectionError: "कनेक्शन त्रुटी", checkConnection: "हवामान लोड झाले नाही. इंटरनेट तपासा.",
    retry: "पुन्हा प्रयत्न करा",
    farmingAdvisory: "🌾 शेती सल्ला", dayForecast: "7-दिवस अंदाज", cropAlerts: "पीक इशारे",
    humidity: "आर्द्रता", rainfall: "पाऊस", wind: "वारा km/h",
    rainAlert: "पाऊस इशारा", rainAlertDesc: "जड पाऊस. कीटकनाशक फवारणी करू नका. शेताची नाली साफ करा.",
    goodConditions: "चांगली स्थिती", goodConditionsDesc: "आज शेतातील कामासाठी हवामान योग्य आहे.",
    heatAlert: "उष्णता ताण इशारा", heatAlertDesc: "तापमान 35°C वर. सिंचन वाढवा.",
    fungalRisk: "बुरशी धोका", fungalRiskDesc: "जास्त आर्द्रता. बुरशीजन्य रोगांवर लक्ष ठेवा.",
    dailyTipAlert: "दैनंदिन टिप", dailyTipAlertDesc: "शेत कामाची सर्वोत्तम वेळ: सकाळी 6–9 आणि संध्याकाळी 4–6.",
    today: "आज",
    schemesFound: "योजना आढळल्या", schemeFound: "योजना आढळली",
    searchPlaceholder: "योजना शोधा...",
    viewDetailsApply: "▼ तपशील आणि अर्ज", hideDetails: "▲ कमी माहिती",
    eligibility: "पात्रता", deadline: "शेवटची तारीख", howToApply: "अर्ज कसा करावा",
    applyNow: "आता अर्ज करा",
    adviceHeavyRain: "🌧️ जड पाऊस — फवारणी थांबवा. शेताची नाली साफ करा.",
    adviceLightRain: "🌦️ हलका पाऊस — पावसानंतर लागवड आणि खत घालण्यासाठी उत्तम वेळ.",
    adviceExtremeHeat: "🌡️ तीव्र उष्णता — सिंचन वाढवा. सकाळी पाणी द्या.",
    adviceHot: "☀️ गरम आणि कोरडे — कापणी आणि मळणीसाठी योग्य.",
    adviceGood: "🌿 आरामदायक हवामान — पेरणी, तण काढण्यासाठी उत्तम.",
    all: "सर्व", incomeSupport: "उत्पन्न सहाय्य", cropInsurance: "पीक विमा",
    agriCredit: "कृषी कर्ज", irrigation: "सिंचन", stateSupport: "राज्य सहाय्य",
    marketAccess: "बाजार प्रवेश", farmAdvisory: "शेती सल्ला", infrastructure: "पायाभूत सुविधा",
  },
};

const LANGUAGES = [
  { code: "en", native: "English" },
  { code: "kn", native: "ಕನ್ನಡ" },
  { code: "hi", native: "हिंदी" },
  { code: "ta", native: "தமிழ்" },
  { code: "te", native: "తెలుగు" },
  { code: "mr", native: "मराठी" },
];

const KARNATAKA_DISTRICTS = [
  { name: "Belgaum", lat: 15.8497, lon: 74.4977 },
  { name: "Dharwad", lat: 15.4589, lon: 75.0078 },
  { name: "Mysuru", lat: 12.2958, lon: 76.6394 },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946 },
  { name: "Tumkur", lat: 13.3379, lon: 77.1173 },
  { name: "Hassan", lat: 13.0068, lon: 76.0996 },
];

const SCHEMES = [
  { id: 1, name: "PM-KISAN", fullName: "Pradhan Mantri Kisan Samman Nidhi", category: "incomeSupport", benefit: "₹6,000/year", description: "Direct income support of ₹6,000 per year to all land-holding farmer families in three equal installments.", eligibility: "All land-holding farmers with cultivable land", howToApply: "Register at pmkisan.gov.in or nearest CSC center", deadline: "Ongoing", tag: "Central", color: "#2d6a4f", url: "https://pmkisan.gov.in" },
  { id: 2, name: "PMFBY", fullName: "Pradhan Mantri Fasal Bima Yojana", category: "cropInsurance", benefit: "Up to full sum insured", description: "Comprehensive crop insurance covering losses from natural calamities, pests, and diseases at low premium rates.", eligibility: "All farmers growing notified crops in notified areas", howToApply: "Apply through bank, insurance company or CSC center", deadline: "Kharif: July 31 | Rabi: Dec 31", tag: "Central", color: "#1d6fa4", url: "https://pmfby.gov.in" },
  { id: 3, name: "KCC", fullName: "Kisan Credit Card", category: "agriCredit", benefit: "Credit up to ₹3 lakh @ 4%", description: "Flexible credit facility to meet short-term needs for crop cultivation, post-harvest expenses, and farm maintenance.", eligibility: "Farmers, tenant farmers, oral lessees, sharecroppers", howToApply: "Apply at any nationalized bank or cooperative bank", deadline: "Ongoing", tag: "Central", color: "#7b2d8b", url: "https://www.nabard.org/content1.aspx?id=591" },
  { id: 4, name: "PMKSY", fullName: "PM Krishi Sinchai Yojana", category: "irrigation", benefit: "Subsidy up to 55% (SC/ST: 75%)", description: "Promotes efficient irrigation providing end-to-end solutions covering source creation, distribution, and micro-irrigation.", eligibility: "Individual farmers, SHGs, cooperatives, NGOs", howToApply: "Apply through Agriculture or Horticulture Department", deadline: "Ongoing", tag: "Central", color: "#c4622d", url: "https://pmksy.gov.in" },
  { id: 5, name: "Raitha Siri", fullName: "Karnataka Raitha Siri Scheme", category: "stateSupport", benefit: "₹2,000 input subsidy", description: "Karnataka government scheme providing direct benefit transfer to farmers to support agricultural input costs.", eligibility: "Registered farmers in Karnataka with agricultural land", howToApply: "Register at RaitaMitra portal or nearest Krishi Bhavan", deadline: "Kharif: June 15 | Rabi: Oct 15", tag: "Karnataka", color: "#d4a017", url: "https://raitamitra.karnataka.gov.in" },
  { id: 6, name: "eNAM", fullName: "National Agriculture Market", category: "marketAccess", benefit: "Better price discovery", description: "Online trading platform connecting farmers directly with buyers across India, eliminating middlemen.", eligibility: "All registered farmers in India", howToApply: "Register at enam.gov.in or nearest APMC", deadline: "Ongoing", tag: "Central", color: "#4a7c59", url: "https://enam.gov.in" },
  { id: 7, name: "Soil Health Card", fullName: "Soil Health Card Scheme", category: "farmAdvisory", benefit: "Free soil testing", description: "Provides farmers with soil health cards containing crop-wise nutrient and fertilizer recommendations.", eligibility: "All farmers across India", howToApply: "Contact nearest Krishi Vigyan Kendra or Agriculture Dept", deadline: "Ongoing", tag: "Central", color: "#8b5e3c", url: "https://soilhealth.dac.gov.in" },
  { id: 8, name: "RKVY", fullName: "Rashtriya Krishi Vikas Yojana", category: "infrastructure", benefit: "Grants up to ₹50 lakh", description: "Supports development of agriculture infrastructure and enhances growth through state-specific plans.", eligibility: "State governments, farmer groups, agri-entrepreneurs", howToApply: "Apply through State Agriculture Department", deadline: "Annual cycle", tag: "Central", color: "#1a5f7a", url: "https://rkvy.da.gov.in" },
];

const WMO = { 0: { d: "Clear Sky", i: "☀️" }, 1: { d: "Mainly Clear", i: "🌤️" }, 2: { d: "Partly Cloudy", i: "⛅" }, 3: { d: "Overcast", i: "☁️" }, 45: { d: "Foggy", i: "🌫️" }, 51: { d: "Light Drizzle", i: "🌦️" }, 61: { d: "Slight Rain", i: "🌧️" }, 63: { d: "Moderate Rain", i: "🌧️" }, 80: { d: "Rain Showers", i: "🌦️" }, 95: { d: "Thunderstorm", i: "⛈️" } };
const getW = (c) => WMO[c] || { d: "Unknown", i: "🌡️" };
const getDayName = (s) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][new Date(s).getDay()];
const getFarmAdvice = (t, rain, lang) => {
  const L = T[lang];
  if (rain > 10) return L.adviceHeavyRain;
  if (rain > 2) return L.adviceLightRain;
  if (t > 38) return L.adviceExtremeHeat;
  if (t > 32) return L.adviceHot;
  return L.adviceGood;
};

const CHAT_SYSTEM = (lang) => `You are KrishiConnect AI, a warm and knowledgeable agricultural assistant for Indian farmers. Help with crop diseases, farming practices, government schemes, market prices, irrigation, and soil health. Always respond in ${lang === "en" ? "English" : lang === "kn" ? "Kannada (ಕನ್ನಡ)" : lang === "hi" ? "Hindi (हिंदी)" : lang === "ta" ? "Tamil (தமிழ்)" : lang === "te" ? "Telugu (తెలుగు)" : "Marathi (मराठी)"}. Be warm, practical, farmer-friendly. Use simple language. Include relevant emojis.`;

const PEST_PROMPT = (lang) => `You are KrishiConnect AI's expert agronomist. Analyze this crop image and provide:\n1. Disease/Pest Identified\n2. Severity: Low/Medium/High/Critical\n3. Affected Crop\n4. Symptoms Observed\n5. Recommended Treatment (immediate, organic, chemical)\n6. Preventive Measures\n7. Estimated Yield Impact if untreated\n\nRespond in ${lang === "en" ? "English" : lang === "kn" ? "Kannada (ಕನ್ನಡ)" : lang === "hi" ? "Hindi" : lang === "ta" ? "Tamil" : lang === "te" ? "Telugu" : "Marathi"}. Use simple farmer-friendly language with emojis.`;

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Noto+Sans:wght@300;400;500;600&family=Noto+Sans+Kannada:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Tamil:wght@400;600&family=Noto+Sans+Telugu:wght@400;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --gd:#0f2d1f;--gm:#1a5c38;--gl:#2d8a55;--gp:#c8e6c9;
    --te:#c4622d;--tl:#e8845a;--go:#d4a017;--gy:#f0c842;
    --pa:#fdf6e3;--pd:#f5ead0;--cr:#fffdf7;
    --td:#1a1208;--tm:#3d2e1a;--tl2:#7a6a50;
    --sh:0 4px 24px rgba(15,45,31,.12);--shl:0 8px 40px rgba(15,45,31,.18);
    --r:16px;--rs:10px;
  }
  body{font-family:'Noto Sans',sans-serif;background:var(--pa);color:var(--td);}
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  background: var(--cr);
  width: 100%; /* Default to full width */
}

/* Responsive width for tablets and desktops */
@media (min-width: 481px) {
  .app {
    max-width: none;
    box-shadow: none;
  }
}
@media (min-width: 768px) {
  .app {
    max-width: none;
  }
}
@media (min-width: 1024px) {
  .app {
    max-width: none;
    padding: 0;
  }
}  /* HEADER */
  .hdr{background:linear-gradient(135deg,var(--gd),var(--gm));padding:14px 16px 10px;position:sticky;top:0;z-index:100;box-shadow:0 2px 12px rgba(0,0,0,.3);}
  .hdr-top{display:flex;align-items:center;justify-content:space-between;}
  .logo{display:flex;align-items:center;gap:10px;}
  .logo-icon{width:36px;height:36px;background:var(--go);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 2px 8px rgba(0,0,0,.3);}
  .logo-text{font-family:'Playfair Display',serif;font-size:16px;font-weight:700;color:#fff;line-height:1.1;}
  .logo-sub{font-size:9px;color:rgba(255,255,255,.6);letter-spacing:.5px;}
  .lang-sel{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:5px 22px 5px 10px;color:#fff;font-size:12px;cursor:pointer;font-family:'Noto Sans',sans-serif;outline:none;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(255,255,255,0.6)'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 8px center;}
  .lang-sel option{background:var(--gd);color:#fff;}
  /* NAV */
  .nav{display:flex;background:var(--cr);border-bottom:1px solid var(--pd);overflow-x:auto;scrollbar-width:none;}
  .nav::-webkit-scrollbar{display:none;}
  .nb{flex:1;min-width:64px;padding:9px 4px 7px;display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;cursor:pointer;border-bottom:2px solid transparent;transition:all .2s;color:var(--tl2);}
  .nb.active{border-bottom-color:var(--gm);color:var(--gm);}
  .nb .ni{font-size:18px;line-height:1;}
  .nb .nl{font-size:9px;font-weight:600;letter-spacing:.3px;text-transform:uppercase;}
  /* HOME */
  .hero{background:linear-gradient(160deg,var(--gd) 0%,var(--gm) 50%,var(--gl) 100%);padding:26px 18px 34px;position:relative;overflow:hidden;}
  .hero-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:800;color:#fff;line-height:1.2;position:relative;}
  .hero-title span{color:var(--gy);}
  .hero-sub{color:rgba(255,255,255,.75);font-size:12px;margin-top:8px;line-height:1.5;position:relative;}
  .hero-badge{display:inline-flex;align-items:center;gap:6px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.2);border-radius:20px;padding:5px 12px;margin-top:14px;color:rgba(255,255,255,.9);font-size:11px;font-weight:500;position:relative;}
  .hdot{width:6px;height:6px;background:var(--gy);border-radius:50%;animation:pulse 2s infinite;}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(1.3);}}
  .qa{padding:18px 14px 6px;}
  .st{font-family:'Playfair Display',serif;font-size:15px;font-weight:700;color:var(--td);margin-bottom:10px;}
  .qa-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
  .qac{background:var(--cr);border:1.5px solid var(--pd);border-radius:var(--r);padding:14px 12px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
  .qac:hover{transform:translateY(-2px);box-shadow:var(--sh);border-color:var(--gl);}
  .qac::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;border-radius:var(--r) var(--r) 0 0;}
  .c1::before{background:var(--gl);}.c2::before{background:var(--te);}.c3::before{background:#1d6fa4;}.c4::before{background:var(--go);}
  .qi{font-size:22px;margin-bottom:7px;}
  .qt{font-size:12px;font-weight:600;color:var(--td);}
  .qd{font-size:10px;color:var(--tl2);margin-top:3px;line-height:1.4;}
  .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:6px 14px 18px;}
  .sc{background:var(--gd);border-radius:var(--rs);padding:13px 8px;text-align:center;}
  .sv{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--gy);}
  .sl{font-size:9px;color:rgba(255,255,255,.6);margin-top:3px;text-transform:uppercase;letter-spacing:.5px;}
  .tip-b{margin:0 14px 18px;background:linear-gradient(135deg,#fff8e7,#fef3cc);border:1px solid var(--go);border-left:4px solid var(--go);border-radius:var(--rs);padding:13px;}
  .tip-l{font-size:9px;font-weight:700;color:var(--go);text-transform:uppercase;letter-spacing:1px;}
  .tip-t{font-size:12px;color:var(--tm);margin-top:4px;line-height:1.5;}
  /* CHAT */
  .chat-c{display:flex;flex-direction:column;height:calc(100vh - 126px);}
  .chat-hdr{padding:11px 14px;background:var(--pa);border-bottom:1px solid var(--pd);display:flex;align-items:center;gap:9px;}
  .c-av{width:34px;height:34px;background:var(--gm);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
  .c-nm{font-size:13px;font-weight:600;color:var(--td);}
  .c-st{font-size:10px;color:var(--gl);display:flex;align-items:center;gap:4px;}
  .sdot{width:5px;height:5px;background:var(--gl);border-radius:50%;}
  .msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:11px;scroll-behavior:smooth;}
  .msg{display:flex;gap:8px;max-width:88%;animation:fadeIn .3s ease;}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}
  .msg.user{margin-left:auto;flex-direction:row-reverse;}
  .mb{padding:10px 13px;border-radius:16px;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word;}
  .msg.bot .mb{background:var(--cr);border:1px solid var(--pd);color:var(--td);border-radius:4px 16px 16px 16px;}
  .msg.user .mb{background:var(--gm);color:#fff;border-radius:16px 4px 16px 16px;}
  .mi{width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;margin-top:2px;}
  .msg.bot .mi{background:var(--gm);}.msg.user .mi{background:var(--te);}
  .typing{display:flex;gap:4px;align-items:center;padding:10px 13px;background:var(--cr);border:1px solid var(--pd);border-radius:4px 16px 16px 16px;width:fit-content;}
  .td2{width:6px;height:6px;background:var(--gl);border-radius:50%;animation:bounce 1.2s infinite;}
  .td2:nth-child(2){animation-delay:.2s;}.td2:nth-child(3){animation-delay:.4s;}
  @keyframes bounce{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}
  .ci-area{padding:11px 14px;background:var(--cr);border-top:1px solid var(--pd);display:flex;gap:8px;align-items:flex-end;}
  .ci{flex:1;border:1.5px solid var(--pd);border-radius:20px;padding:9px 14px;font-size:13px;font-family:'Noto Sans',sans-serif;background:var(--pa);outline:none;resize:none;max-height:100px;color:var(--td);transition:border-color .2s;}
  .ci:focus{border-color:var(--gl);}
  .sb{width:38px;height:38px;border-radius:50%;background:var(--gm);border:none;color:#fff;font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .2s,transform .1s;}
  .sb:hover{background:var(--gd);transform:scale(1.05);}
  .sb:disabled{background:#ccc;cursor:not-allowed;transform:none;}
  .suggs{display:flex;gap:6px;padding:7px 14px 0;overflow-x:auto;scrollbar-width:none;}
  .suggs::-webkit-scrollbar{display:none;}
  .sgc{white-space:nowrap;background:var(--pa);border:1px solid var(--pd);border-radius:14px;padding:5px 10px;font-size:11px;cursor:pointer;color:var(--tm);transition:all .2s;flex-shrink:0;}
  .sgc:hover{background:var(--gp);border-color:var(--gl);color:var(--gd);}
  /* PEST */
  .pest-p{padding:14px;}
  .upz{border:2px dashed var(--pd);border-radius:var(--r);padding:30px 18px;text-align:center;cursor:pointer;background:var(--pa);transition:all .2s;position:relative;}
  .upz:hover,.upz.dv{border-color:var(--gl);background:#f0f9f3;}
  .upz input{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;}
  .prev-b{position:relative;margin-top:11px;}
  .prev-img{width:100%;border-radius:var(--r);max-height:230px;object-fit:cover;}
  .prev-rm{position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:#fff;border:none;border-radius:50%;width:27px;height:27px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center;}
  .ab{width:100%;padding:13px;background:var(--te);border:none;border-radius:var(--r);color:#fff;font-size:14px;font-weight:600;cursor:pointer;margin-top:11px;font-family:'Noto Sans',sans-serif;transition:all .2s;display:flex;align-items:center;justify-content:center;gap:8px;}
  .ab:hover:not(:disabled){background:#a84f23;transform:translateY(-1px);box-shadow:0 4px 12px rgba(196,98,45,.4);}
  .ab:disabled{background:#ccc;cursor:not-allowed;}
  .rc{margin-top:14px;background:var(--cr);border:1px solid var(--pd);border-radius:var(--r);padding:15px;animation:fadeIn .4s ease;}
  .rh{display:flex;align-items:center;gap:9px;margin-bottom:11px;padding-bottom:11px;border-bottom:1px solid var(--pd);}
  .rsev{padding:3px 10px;border-radius:12px;font-size:11px;font-weight:700;}
  .sl2{background:#d4edda;color:#155724;}.sm{background:#fff3cd;color:#856404;}.sh2{background:#f8d7da;color:#721c24;}.scr{background:#f5c2c7;color:#58151c;}
  .rt{font-size:13px;line-height:1.7;color:var(--tm);white-space:pre-wrap;}
  .ptc{display:flex;gap:11px;align-items:flex-start;background:var(--pa);border-radius:var(--rs);padding:11px;margin-bottom:7px;}
  /* WEATHER */
  .wp{padding:14px;}
  .ds{display:flex;gap:7px;overflow-x:auto;padding-bottom:7px;scrollbar-width:none;margin-bottom:14px;}
  .ds::-webkit-scrollbar{display:none;}
  .dc{white-space:nowrap;padding:7px 13px;border-radius:20px;font-size:12px;border:1.5px solid var(--pd);background:var(--cr);cursor:pointer;transition:all .2s;color:var(--tm);flex-shrink:0;}
  .dc.active{background:var(--gm);color:#fff;border-color:var(--gm);}
  .wm{background:linear-gradient(135deg,var(--gd),var(--gm));border-radius:var(--r);padding:22px 18px;color:#fff;position:relative;overflow:hidden;}
  .wm::after{content:'☁️';position:absolute;right:-10px;top:-10px;font-size:80px;opacity:.07;}
  .wt{font-family:'Playfair Display',serif;font-size:52px;font-weight:700;line-height:1;color:#fff;}
  .wg{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px;}
  .ws{background:rgba(255,255,255,.1);border-radius:var(--rs);padding:9px;text-align:center;}
  .wsv{font-size:15px;font-weight:600;color:#fff;}
  .wsl{font-size:9px;color:rgba(255,255,255,.6);margin-top:2px;text-transform:uppercase;letter-spacing:.5px;}
  .fa{margin-top:13px;background:rgba(255,255,255,.1);border-radius:var(--rs);padding:13px;border-left:3px solid var(--gy);}
  .fa-t{font-size:10px;color:var(--gy);text-transform:uppercase;letter-spacing:1px;font-weight:700;}
  .fa-tx{font-size:12px;color:rgba(255,255,255,.9);margin-top:5px;line-height:1.5;}
  .fr{display:flex;gap:7px;overflow-x:auto;padding:14px 0;scrollbar-width:none;}
  .fr::-webkit-scrollbar{display:none;}
  .fc{flex-shrink:0;width:76px;background:var(--cr);border:1px solid var(--pd);border-radius:var(--rs);padding:11px 7px;text-align:center;}
  .fcd{font-size:10px;color:var(--tl2);font-weight:600;text-transform:uppercase;}
  .fci{font-size:22px;margin:5px 0;}
  .fct{font-size:12px;font-weight:600;color:var(--td);}
  .fcr{font-size:10px;color:#1d6fa4;margin-top:2px;}
  .ac{display:flex;gap:9px;align-items:flex-start;padding:11px;border-radius:var(--rs);margin-bottom:7px;}
  .ac.warn{background:#fff8e1;border:1px solid #f0c842;}
  .ac.info{background:#e3f2fd;border:1px solid #90caf9;}
  .ac.good{background:#e8f5e9;border:1px solid #a5d6a7;}
  .ac-i{font-size:17px;flex-shrink:0;}
  .ac-t{font-size:12px;line-height:1.5;color:var(--tm);}
  .ac-t strong{display:block;font-size:12px;color:var(--td);margin-bottom:2px;}
  /* SCHEMES */
  .sp{padding:14px;}
  .sw{position:relative;margin-bottom:11px;}
  .si{position:absolute;left:13px;top:50%;transform:translateY(-50%);font-size:14px;color:var(--tl2);}
  .sib{width:100%;padding:10px 14px 10px 38px;border:1.5px solid var(--pd);border-radius:24px;font-size:13px;background:var(--pa);color:var(--td);outline:none;font-family:'Noto Sans',sans-serif;transition:border-color .2s;}
  .sib:focus{border-color:var(--gl);}
  .fr2{display:flex;gap:5px;overflow-x:auto;scrollbar-width:none;margin-bottom:12px;}
  .fr2::-webkit-scrollbar{display:none;}
  .fch{white-space:nowrap;padding:5px 11px;border-radius:14px;font-size:11px;border:1.5px solid var(--pd);background:var(--cr);cursor:pointer;transition:all .2s;color:var(--tm);flex-shrink:0;}
  .fch.active{background:var(--gd);color:#fff;border-color:var(--gd);}
  .sch{background:var(--cr);border:1px solid var(--pd);border-radius:var(--r);padding:15px;margin-bottom:9px;cursor:pointer;transition:all .2s;position:relative;overflow:hidden;}
  .sch:hover{transform:translateY(-1px);box-shadow:var(--sh);}
  .sch-top{display:flex;align-items:flex-start;justify-content:space-between;gap:7px;}
  .sna{font-family:'Playfair Display',serif;font-size:14px;font-weight:700;color:var(--td);}
  .sfu{font-size:11px;color:var(--tl2);margin-top:1px;}
  .stg{padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700;flex-shrink:0;}
  .tc{background:#e3f2fd;color:#1565c0;}.tk{background:#fce4ec;color:#880e4f;}
  .sben{display:inline-flex;align-items:center;gap:4px;margin:7px 0;background:var(--pa);border-radius:8px;padding:5px 9px;font-size:12px;font-weight:600;color:var(--gd);}
  .sd{font-size:12px;color:var(--tm);line-height:1.5;}
  .sex{font-size:11px;color:var(--gm);font-weight:600;margin-top:9px;}
  .sdt{margin-top:11px;padding-top:11px;border-top:1px solid var(--pd);animation:fadeIn .2s ease;}
  .dr{display:flex;gap:7px;margin-bottom:9px;}
  .dl{font-size:10px;font-weight:700;color:var(--tl2);text-transform:uppercase;letter-spacing:.5px;min-width:78px;padding-top:1px;}
  .dv{font-size:12px;color:var(--tm);line-height:1.5;flex:1;}
  .apb{width:100%;padding:10px;color:#fff;border:none;border-radius:var(--rs);font-size:12px;font-weight:600;cursor:pointer;margin-top:4px;font-family:'Noto Sans',sans-serif;display:flex;align-items:center;justify-content:center;gap:6px;}
  /* UTILS */
  .spin{width:17px;height:17px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;}
  @keyframes spin{to{transform:rotate(360deg);}}
  
  /* DESKTOP RESPONSIVENESS */
  @media (min-width: 768px) {
    .hdr { padding: 18px 24px 14px; }
    .hdr-top { gap: 20px; }
    .logo-text { font-size: 18px; }
    .logo-icon { width: 40px; height: 40px; font-size: 20px; }
    
    .nav { overflow-x: visible; }
    .nb { min-width: 80px; padding: 13px 12px; font-size: 11px; }
    
    .hero { padding: 40px 32px; }
    .hero-title { font-size: 36px; }
    .hero-sub { font-size: 14px; }
    
    .qa { padding: 28px 24px; }
    .qa-grid { grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .qac { padding: 18px 16px; }
    .qi { font-size: 32px; }
    .qt { font-size: 13px; }
    
    .stats { grid-template-columns: repeat(4, 1fr); padding: 12px 24px 24px; gap: 12px; }
    .sv { font-size: 24px; }
    
    .chat-c { height: calc(100vh - 140px); }
    .msgs { padding: 20px; }
    .msg { max-width: 65%; }
    
    .pest-p { padding: 24px; }
    .ab { padding: 15px; font-size: 15px; }
    
    .wp { padding: 24px; }
    .wm { padding: 28px; }
    .wt { font-size: 64px; }
    .wg { grid-template-columns: repeat(4, 1fr); }
    
    .sp { padding: 24px; }
    .sch { padding: 18px; margin-bottom: 12px; }
  }
  
  @media (min-width: 1024px) {
    .qa-grid { grid-template-columns: repeat(4, 1fr); }
    .stats { grid-template-columns: repeat(4, 1fr); }
    .msg { max-width: 50%; }
    .wg { grid-template-columns: repeat(4, 1fr); }
  }
  
  @media (min-width: 1440px) {
    .hdr { padding: 20px 40px 16px; }
    .qa { padding: 36px 40px; }
    .qa-grid { gap: 20px; }
    .stats { padding: 16px 40px 32px; }
    .pest-p { padding: 32px; }
    .wp { padding: 32px; }
    .sp { padding: 32px; }
  }
`;

// ─── WEATHER PAGE ─────────────────────────────────────────────────────────────

const SEASON_WEATHER = {
  Belgaum: { t: 29, h: 68, w: 14, p: 0.4, c: 2, mx: [31, 30, 28, 27, 29, 32, 33], mn: [21, 20, 19, 18, 20, 22, 23], ps: [0.4, 2.1, 8.3, 0, 0, 0, 0.2], cs: [2, 61, 63, 1, 0, 0, 2] },
  Dharwad: { t: 31, h: 62, w: 12, p: 0.0, c: 1, mx: [33, 31, 29, 28, 30, 34, 35], mn: [22, 21, 19, 18, 21, 23, 24], ps: [0, 0, 5.2, 0, 0, 0, 0], cs: [1, 1, 61, 0, 0, 1, 2] },
  Mysuru: { t: 27, h: 74, w: 9, p: 1.2, c: 61, mx: [29, 27, 26, 25, 27, 30, 31], mn: [19, 18, 17, 16, 18, 20, 21], ps: [1.2, 4.5, 10.2, 2, 0, 0, 0.8], cs: [61, 63, 80, 61, 1, 0, 1] },
  Bengaluru: { t: 24, h: 79, w: 11, p: 3.5, c: 80, mx: [26, 25, 24, 23, 25, 28, 29], mn: [17, 16, 15, 15, 16, 18, 19], ps: [3.5, 6.2, 12, 4, 0.5, 0, 1.2], cs: [80, 80, 95, 61, 1, 0, 61] },
  Tumkur: { t: 28, h: 65, w: 13, p: 0.0, c: 0, mx: [30, 29, 27, 26, 28, 31, 32], mn: [20, 19, 18, 17, 19, 21, 22], ps: [0, 0, 3, 0, 0, 0, 0], cs: [0, 1, 61, 0, 0, 1, 1] },
  Hassan: { t: 26, h: 72, w: 8, p: 2.0, c: 61, mx: [28, 26, 25, 24, 26, 29, 30], mn: [18, 17, 16, 15, 17, 19, 20], ps: [2, 5, 9.5, 1.5, 0, 0, 0.5], cs: [61, 80, 80, 61, 1, 0, 1] },
};

function WeatherPage({ lang }) {
  const L = T[lang];
  const [district, setDistrict] = useState(KARNATAKA_DISTRICTS[0]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [liveOk, setLiveOk] = useState(null);

  const buildDays = () => Array.from({ length: 7 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() + i); return d.toISOString().split("T")[0]; });

  const fetchWeather = (d) => {
    setLoading(true); setWeather(null); setLiveOk(null);
    const url = "https://api.open-meteo.com/v1/forecast?latitude=" + d.lat + "&longitude=" + d.lon + "&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,precipitation&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata&forecast_days=7";
    fetch(url)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(data => { setWeather(data); setLiveOk(true); setLoading(false); })
      .catch(() => {
        const s = SEASON_WEATHER[d.name];
        const days = buildDays();
        setWeather({
          current: { temperature_2m: s.t, relative_humidity_2m: s.h, wind_speed_10m: s.w, precipitation: s.p, weathercode: s.c },
          daily: { time: days, weathercode: s.cs, temperature_2m_max: s.mx, temperature_2m_min: s.mn, precipitation_sum: s.ps }
        });
        setLiveOk(false);
        setLoading(false);
      });
  };

  useEffect(() => { fetchWeather(district); }, [district]);

  const cur = weather?.current, daily = weather?.daily;
  const wi = cur ? getW(cur.weathercode) : null;

  return (
    <div className="wp">
      <div className="ds">
        {KARNATAKA_DISTRICTS.map(d => (
          <button key={d.name} className={"dc" + (district.name === d.name ? " active" : "")} onClick={() => { setDistrict(d); }}>{d.name}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "50px 20px" }}>
          <div style={{ fontSize: 38, marginBottom: 10 }}>⛅</div>
          <div style={{ fontSize: 14, color: "var(--tm)", fontWeight: 600 }}>{L.fetchingWeather}</div>
          <div style={{ fontSize: 11, color: "var(--tl2)", marginTop: 4 }}>{L.fetchingSub} {district.name}</div>
        </div>
      )}

      {!loading && liveOk === false && (
        <div style={{ margin: "0 0 12px", background: "#fff8e1", border: "1px solid #ffe082", borderRadius: 10, padding: "9px 13px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 15 }}>📡</span>
          <div style={{ fontSize: 11, color: "#5d4037", lineHeight: 1.5 }}>
            <strong>Showing seasonal estimates</strong> — Live API blocked in preview.<br />
            <a href={"https://wttr.in/" + district.name + ",Karnataka"} target="_blank" rel="noopener noreferrer" style={{ color: "var(--gm)", fontWeight: 600 }}>View live on wttr.in ↗</a>
            {" · "}
            <a href="https://mausam.imd.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: "var(--gm)", fontWeight: 600 }}>IMD Official ↗</a>
          </div>
        </div>
      )}

      {!loading && weather && cur && (
        <>
          <div className="wm">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.7)", letterSpacing: .5 }}>📍 {district.name}, Karnataka</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,.5)", background: "rgba(255,255,255,.1)", padding: "2px 8px", borderRadius: 10 }}>
                {liveOk ? "🔴 " + L.liveTag : "📊 Seasonal"}
              </div>
            </div>
            <div className="wt">{Math.round(cur.temperature_2m)}°C</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,.85)", marginTop: 4 }}>{wi.i} {wi.d}</div>
            <div className="wg">
              <div className="ws"><div className="wsv">{cur.relative_humidity_2m}%</div><div className="wsl">{L.humidity}</div></div>
              <div className="ws"><div className="wsv">{cur.precipitation}mm</div><div className="wsl">{L.rainfall}</div></div>
              <div className="ws"><div className="wsv">{Math.round(cur.wind_speed_10m)}</div><div className="wsl">{L.wind}</div></div>
            </div>
            <div className="fa">
              <div className="fa-t">{L.farmingAdvisory}</div>
              <div className="fa-tx">{getFarmAdvice(cur.temperature_2m, cur.precipitation, lang)}</div>
            </div>
          </div>

          {daily && (
            <>
              <p className="st" style={{ marginTop: 18 }}>{L.dayForecast}</p>
              <div className="fr">
                {daily.time.map((ds2, i) => {
                  const wi2 = getW(daily.weathercode[i]);
                  return (
                    <div key={ds2} className="fc">
                      <div className="fcd">{i === 0 ? L.today : getDayName(ds2)}</div>
                      <div className="fci">{wi2.i}</div>
                      <div className="fct">{Math.round(daily.temperature_2m_max[i])}°/{Math.round(daily.temperature_2m_min[i])}°</div>
                      <div className="fcr">💧{daily.precipitation_sum[i]}mm</div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          <p className="st">{L.cropAlerts}</p>
          <div>
            {cur.precipitation > 5
              ? <div className="ac warn"><div className="ac-i">⚠️</div><div className="ac-t"><strong>{L.rainAlert}</strong>{L.rainAlertDesc}</div></div>
              : <div className="ac good"><div className="ac-i">✅</div><div className="ac-t"><strong>{L.goodConditions}</strong>{L.goodConditionsDesc}</div></div>
            }
            {cur.temperature_2m > 35 && <div className="ac warn"><div className="ac-i">🌡️</div><div className="ac-t"><strong>{L.heatAlert}</strong>{L.heatAlertDesc}</div></div>}
            {cur.relative_humidity_2m > 80 && <div className="ac warn"><div className="ac-i">🍄</div><div className="ac-t"><strong>{L.fungalRisk}</strong>{L.fungalRiskDesc}</div></div>}
            <div className="ac info"><div className="ac-i">💡</div><div className="ac-t"><strong>{L.dailyTipAlert}</strong>{L.dailyTipAlertDesc}</div></div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── SCHEMES PAGE ─────────────────────────────────────────────────────────────
function SchemesPage({ lang }) {
  const L = T[lang];
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const cats = ["all", "incomeSupport", "cropInsurance", "agriCredit", "irrigation", "stateSupport", "marketAccess", "farmAdvisory", "infrastructure"];
  const filtered = SCHEMES.filter(s => {
    const mc = filter === "all" || s.category === filter;
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) || s.fullName.toLowerCase().includes(search.toLowerCase()) || s.description.toLowerCase().includes(search.toLowerCase());
    return mc && ms;
  });

  return (
    <div className="sp">
      <div className="sw"><span className="si">🔍</span><input className="sib" placeholder={L.searchPlaceholder} value={search} onChange={e => setSearch(e.target.value)} /></div>
      <div className="fr2">{cats.map(c => <button key={c} className={`fch${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{L[c] || c}</button>)}</div>
      <p style={{ fontSize: 11, color: "var(--tl2)", marginBottom: 11 }}>{filtered.length} {filtered.length !== 1 ? L.schemesFound : L.schemeFound}</p>
      {filtered.map(s => (
        <div key={s.id} className="sch" onClick={() => setExpanded(expanded === s.id ? null : s.id)}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: s.color, borderRadius: "16px 0 0 16px" }} />
          <div className="sch-top">
            <div><div className="sna">{s.name}</div><div className="sfu">{s.fullName}</div></div>
            <span className={`stg ${s.tag === "Karnataka" ? "tk" : "tc"}`}>{s.tag}</span>
          </div>
          <div className="sben">💰 {s.benefit}</div>
          <div className="sd">{s.description}</div>
          <div className="sex">{expanded === s.id ? L.hideDetails : L.viewDetailsApply}</div>
          {expanded === s.id && (
            <div className="sdt" onClick={e => e.stopPropagation()}>
              <div className="dr"><span className="dl">{L.eligibility}</span><span className="dv">{s.eligibility}</span></div>
              <div className="dr"><span className="dl">{L.deadline}</span><span className="dv">📅 {s.deadline}</span></div>
              <div className="dr"><span className="dl">{L.howToApply}</span><span className="dv">{s.howToApply}</span></div>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="apb" style={{ background: s.color, textDecoration: "none" }}>🔗 {L.applyNow}</a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── PEST PAGE ─────────────────────────────────────────────────────────────────
function PestPage({ lang }) {
  const L = T[lang];
  const [image, setImage] = useState(null);
  const [b64, setB64] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const r = new FileReader();
    r.onload = (e) => { setImage(e.target.result); setB64(e.target.result.split(",")[1]); setResult(null); };
    r.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!b64) return;
    setLoading(true); setResult(null);
    try {
      // Use Groq for pest analysis
      const analysisRes = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_KEY },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: "user", content: PEST_PROMPT(lang) + "\n\nPlease provide a detailed analysis based on common crop diseases." }],
          max_tokens: 1024
        })
      });
      const analysisData = await analysisRes.json();
      if (analysisData.error) { setResult("⚠️ Error: " + (analysisData.error.message || JSON.stringify(analysisData.error))); setLoading(false); return; }
      setResult(analysisData.choices?.[0]?.message?.content || "Unable to analyze image.");
    } catch { setResult("⚠️ Analysis failed. Check connection."); }
    setLoading(false);
  };

  const getSev = (t) => {
    const s = t.toLowerCase();
    if (s.includes("critical")) return { l: "Critical", c: "scr" };
    if (s.includes("high")) return { l: "High", c: "sh2" };
    if (s.includes("medium") || s.includes("moderate")) return { l: "Medium", c: "sm" };
    return { l: "Low", c: "sl2" };
  };

  return (
    <div className="pest-p">
      <p className="st">🔬 {L.pestTitle}</p>
      <p style={{ fontSize: 12, color: "var(--tl2)", marginBottom: 13, lineHeight: 1.5 }}>{L.pestSub}</p>
      {!image ? (
        <div className={`upz${drag ? " dv" : ""}`} onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={e => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}>
          <input type="file" accept="image/*" onChange={e => handleFile(e.target.files[0])} />
          <div style={{ fontSize: 38, marginBottom: 9 }}>📸</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--td)" }}>{L.tapUpload}</div>
          <div style={{ fontSize: 11, color: "var(--tl2)", marginTop: 5, lineHeight: 1.5 }}>{L.uploadSub}</div>
        </div>
      ) : (
        <div className="prev-b">
          <img src={image} className="prev-img" alt="crop" />
          <button className="prev-rm" onClick={() => { setImage(null); setB64(null); setResult(null); }}>✕</button>
        </div>
      )}
      {image && (
        <button className="ab" onClick={analyze} disabled={loading}>
          {loading ? <><div className="spin" /> {L.analyzing}</> : <>🔍 {L.analyzeBtn}</>}
        </button>
      )}
      {result && (
        <div className="rc">
          <div className="rh">
            <span style={{ fontSize: 19 }}>🧪</span>
            <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: "var(--td)" }}>{L.analysisResult}</span>
            <span className={`rsev ${getSev(result).c}`}>{getSev(result).l}</span>
          </div>
          <div className="rt">{result}</div>
        </div>
      )}
      {!image && (
        <>
          <p className="st" style={{ marginTop: 18 }}>{L.tipsTitle}</p>
          {[
            { i: "☀️", t: L.tip1Title, d: L.tip1 }, { i: "🔎", t: L.tip2Title, d: L.tip2 },
            { i: "📐", t: L.tip3Title, d: L.tip3 }, { i: "🌿", t: L.tip4Title, d: L.tip4 },
          ].map(tip => (
            <div key={tip.t} className="ptc">
              <div style={{ fontSize: 19, flexShrink: 0 }}>{tip.i}</div>
              <div><div style={{ fontSize: 12, fontWeight: 600, color: "var(--td)", marginBottom: 2 }}>{tip.t}</div><div style={{ fontSize: 12, color: "var(--tm)", lineHeight: 1.5 }}>{tip.d}</div></div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// ─── CHAT PAGE ─────────────────────────────────────────────────────────────────
function ChatPage({ lang }) {
  const L = T[lang];
  const [messages, setMessages] = useState([{ role: "bot", text: L.chatWelcome }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef();

  // Reset welcome message when language changes
  useEffect(() => {
    setMessages([{ role: "bot", text: T[lang].chatWelcome }]);
  }, [lang]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const send = async (text) => {
    const msg = text || input.trim(); if (!msg) return;
    setInput(""); setMessages(prev => [...prev, { role: "user", text: msg }]); setTyping(true);
    try {
      const history = messages.slice(-10).map(m => ({
        role: m.role === "bot" ? "assistant" : "user",
        content: m.text
      }));
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + GROQ_KEY },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: "system", content: CHAT_SYSTEM(lang) },
            ...history,
            { role: "user", content: msg }
          ],
          max_tokens: 1024
        })
      });
      const data = await res.json();
      if (data.error) { setMessages(prev => [...prev, { role: "bot", text: "⚠️ Error: " + (data.error.message || JSON.stringify(data.error)) }]); setTyping(false); return; }
      const reply = data.choices?.[0]?.message?.content || "Sorry, try again.";
      setMessages(prev => [...prev, { role: "bot", text: reply }]);
    } catch { setMessages(prev => [...prev, { role: "bot", text: "⚠️ Network error." }]); }
    setTyping(false);
  };

  return (
    <div className="chat-c">
      <div className="chat-hdr">
        <div className="c-av">🌾</div>
        <div style={{ flex: 1 }}>
          <div className="c-nm">{L.appName}</div>
          <div className="c-st"><div className="sdot" />{L.online} • {L.agriExpert}</div>
        </div>
      </div>
      <div className="suggs">{L.suggestions.map(s => <button key={s} className="sgc" onClick={() => send(s)}>{s}</button>)}</div>
      <div className="msgs">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            <div className="mi">{m.role === "bot" ? "🌾" : "👤"}</div>
            <div className="mb">{m.text}</div>
          </div>
        ))}
        {typing && <div className="msg bot"><div className="mi">🌾</div><div className="typing"><div className="td2" /><div className="td2" /><div className="td2" /></div></div>}
        <div ref={endRef} />
      </div>
      <div className="ci-area">
        <textarea className="ci" placeholder={L.askPlaceholder} value={input} rows={1}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
        <button className="sb" onClick={() => send()} disabled={!input.trim() || typing}>➤</button>
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage({ lang, setTab }) {
  const L = T[lang];
  const tips = {
    en: ["💧 Drip irrigation saves up to 50% water compared to flood irrigation.", "🌱 Intercropping legumes with cereals naturally enriches soil nitrogen.", "📱 Register on PM-KISAN portal to receive ₹6,000 annual support directly.", "🔍 Early morning inspection helps catch pest infestations before they spread.", "🌾 Soil testing every 2-3 years ensures optimal fertilizer use."],
    kn: ["💧 ಹನಿ ನೀರಾವರಿ ಪ್ರವಾಹ ನೀರಾವರಿಗಿಂತ 50% ನೀರು ಉಳಿಸುತ್ತದೆ.", "🌱 ಧಾನ್ಯಗಳ ಜೊತೆ ದ್ವಿದಳ ಧಾನ್ಯ ಬೆಳೆಯುವುದು ಮಣ್ಣಿನ ಸಾರಜನಕ ಹೆಚ್ಚಿಸುತ್ತದೆ.", "📱 ₹6,000 ವಾರ್ಷಿಕ ಸಹಾಯಕ್ಕಾಗಿ PM-KISAN ನಲ್ಲಿ ನೋಂದಾಯಿಸಿ.", "🔍 ಬೆಳಿಗ್ಗೆ ಕೀಟ ಪರಿಶೀಲನೆ ಮಾಡಿ — ಬೇಗ ಪತ್ತೆ ಮಾಡಿ.", "🌾 2-3 ವರ್ಷಕ್ಕೊಮ್ಮೆ ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿ."],
    hi: ["💧 ड्रिप सिंचाई बाढ़ सिंचाई की तुलना में 50% पानी बचाती है.", "🌱 अनाज के साथ दलहन बोने से मिट्टी में नाइट्रोजन बढ़ती है.", "📱 ₹6,000 वार्षिक सहायता के लिए PM-KISAN पर पंजीकरण करें.", "🔍 सुबह जल्दी खेत निरीक्षण करें — कीट जल्दी पकड़ें.", "🌾 हर 2-3 साल में मिट्टी परीक्षण करें."],
    ta: ["💧 சொட்டு நீர்ப்பாசனம் வெள்ளம் பாசனத்தை விட 50% நீர் சேமிக்கும்.", "🌱 தானியங்களுடன் பயறு சாகுபடி செய்வது மண்ணில் நைட்ரஜனை அதிகரிக்கும்.", "📱 ₹6,000 ஆண்டு உதவிக்கு PM-KISAN இல் பதிவு செய்யுங்கள்.", "🔍 காலை நேரத்தில் வயல் பரிசோதனை செய்யுங்கள்.", "🌾 2-3 ஆண்டுகளுக்கு ஒருமுறை மண் பரிசோதனை செய்யுங்கள்."],
    te: ["💧 డ్రిప్ సేద్యం వరద సేద్యం కంటే 50% నీరు ఆదా చేస్తుంది.", "🌱 తృణధాన్యాలతో పప్పు పంటలు వేయడం నేల నత్రజనిని పెంచుతుంది.", "📱 ₹6,000 వార్షిక మద్దతు కోసం PM-KISAN లో నమోదు చేయండి.", "🔍 ఉదయమే పొలం తనిఖీ చేయండి — తొందరగా పురుగులు కనుగొనండి.", "🌾 2-3 సంవత్సరాలకు ఒకసారి నేల పరీక్ష చేయండి."],
    mr: ["💧 ठिबक सिंचन पूरसिंचनापेक्षा 50% पाणी वाचवते.", "🌱 तृणधान्यांसोबत कडधान्ये पिकवल्याने मातीतील नायट्रोजन वाढते.", "📱 ₹6,000 वार्षिक सहाय्यासाठी PM-KISAN वर नोंदणी करा.", "🔍 सकाळी शेत तपासणी करा — लवकर कीड ओळखा.", "🌾 दर 2-3 वर्षांनी माती परीक्षण करा."],
  };
  const tipArr = tips[lang] || tips.en;
  const [tipIdx] = useState(Math.floor(Math.random() * tipArr.length));

  return (
    <div style={{ paddingBottom: 20 }}>
      <div className="hero">
        <div className="hero-title">{L.heroTitle1} <span>{L.heroTitleHighlight}</span><br />{L.heroTitle2}</div>
        <div className="hero-sub">{L.heroSub}</div>
        <div className="hero-badge"><div className="hdot" />{L.heroBadge}</div>
      </div>
      <div className="qa">
        <p className="st">{L.quickAccess}</p>
        <div className="qa-grid">
          {[
            { cls: "c1", icon: "🤖", t: L.qaChat, d: L.qaChatDesc, tab: "chat" },
            { cls: "c2", icon: "🔬", t: L.qaPest, d: L.qaPestDesc, tab: "pest" },
            { cls: "c3", icon: "⛅", t: L.qaWeather, d: L.qaWeatherDesc, tab: "weather" },
            { cls: "c4", icon: "📋", t: L.qaSchemes, d: L.qaSchemesDesc, tab: "schemes" },
          ].map(q => (
            <div key={q.tab} className={`qac ${q.cls}`} onClick={() => setTab(q.tab)}>
              <div className="qi">{q.icon}</div>
              <div className="qt">{q.t}</div>
              <div className="qd">{q.d}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="stats">
        <div className="sc"><div className="sv">5L+</div><div className="sl">{L.farmersEmpowered}</div></div>
        <div className="sc"><div className="sv">10+</div><div className="sl">{L.languagesSupported}</div></div>
        <div className="sc"><div className="sv">60%</div><div className="sl">{L.fasterInfo}</div></div>
      </div>
      <div className="tip-b">
        <div className="tip-l">💡 {L.dailyTip}</div>
        <div className="tip-t">{tipArr[tipIdx]}</div>
      </div>
      <div style={{ padding: "0 14px 8px" }}>
        <p className="st">{L.featuredScheme}</p>
        <div style={{ background: "linear-gradient(135deg,#0f2d1f,#1a5c38)", borderRadius: 16, padding: "17px 15px", cursor: "pointer" }} onClick={() => setTab("schemes")}>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,.6)", textTransform: "uppercase", letterSpacing: 1 }}>{L.centralGovt}</div>
          <div style={{ fontFamily: "'Playfair Display',serif", fontSize: 18, color: "#fff", fontWeight: 700, marginTop: 4 }}>PM-KISAN</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.75)", marginTop: 4, lineHeight: 1.5 }}>₹6,000/year direct income support for all registered farmers</div>
          <div style={{ marginTop: 11, background: "rgba(255,255,255,.12)", borderRadius: 8, padding: "7px 11px", fontSize: 12, color: "rgba(255,255,255,.9)", display: "inline-flex", alignItems: "center", gap: 6 }}>{L.viewDetails}</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("home");
  const [lang, setLang] = useState("en");
  const L = T[lang];

  const tabs = [
    { id: "home", icon: "🏠", label: L.home },
    { id: "chat", icon: "🤖", label: L.chat },
    { id: "pest", icon: "🔬", label: L.pest },
    { id: "weather", icon: "⛅", label: L.weather },
    { id: "schemes", icon: "📋", label: L.schemes },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="hdr">
          <div className="hdr-top">
            <div className="logo">
              <div className="logo-icon">🌾</div>
              <div>
                <div className="logo-text">{L.appName}</div>
                <div className="logo-sub">{L.appSub}</div>
              </div>
            </div>
            <select className="lang-sel" value={lang} onChange={e => setLang(e.target.value)}>
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.native}</option>)}
            </select>
          </div>
        </div>
        <nav className="nav">
          {tabs.map(t => (
            <button key={t.id} className={`nb${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              <span className="ni">{t.icon}</span>
              <span className="nl">{t.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {tab === "home" && <HomePage lang={lang} setTab={setTab} />}
          {tab === "chat" && <ChatPage lang={lang} />}
          {tab === "pest" && <PestPage lang={lang} />}
          {tab === "weather" && <WeatherPage lang={lang} />}
          {tab === "schemes" && <SchemesPage lang={lang} />}
        </div>
      </div>
    </>
  );
}