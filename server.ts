import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK if API key is provided
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to query DNS status (DoH via Google Public DNS)
async function checkDnsStatus(domainName: string) {
  try {
    const cleanDomain = domainName.trim().toLowerCase();
    const url = `https://dns.google/resolve?name=${encodeURIComponent(cleanDomain)}&type=SOA`;
    const response = await fetch(url, {
      headers: { Accept: 'application/dns-json' },
      signal: AbortSignal.timeout(4000),
    });

    if (!response.ok) {
      return { status: 'unknown', details: 'DNS query timed out' };
    }

    const data = await response.json() as { Status?: number; Answer?: unknown[]; Authority?: unknown[] };
    // Status 3 is NXDOMAIN -> Domain name does not exist (likely available!)
    // Status 0 is NOERROR -> Domain exists (has SOA/NS or active records)
    if (data.Status === 3) {
      return { status: 'available', details: 'NXDOMAIN - Likely available for registration!' };
    } else if (data.Status === 0) {
      const hasRecords = (data.Answer && data.Answer.length > 0) || (data.Authority && data.Authority.length > 0);
      return {
        status: hasRecords ? 'registered' : 'unknown',
        details: hasRecords ? 'Domain is already registered or active' : 'Status ambiguous',
      };
    }
    return { status: 'unknown', details: `DNS returned status code ${data.Status}` };
  } catch (err: any) {
    return { status: 'unknown', details: err?.message || 'Check failed' };
  }
}

// Fallback high-quality curated domain inventory for Vashisht Joshi
const DEFAULT_DOMAINS = [
  {
    domain: 'vashishtjoshi.com',
    extension: '.com',
    category: 'Exact Personal Brand',
    appealScore: 99,
    memorability: 'High',
    pronounceability: 'Easy & Global',
    priceEstimate: '₹899 - ₹1,299 / yr ($10 - $14)',
    recommendedFor: 'Best overall choice for your personal brand and global professional credibility.',
    suggestedEmails: ['vashisht@vashishtjoshi.com', 'contact@vashishtjoshi.com', 'me@vashishtjoshi.com'],
    badge: 'Recommended',
    tagline: 'Global Gold Standard',
  },
  {
    domain: 'vashishtjoshi.in',
    extension: '.in',
    category: 'India Business Identity',
    appealScore: 96,
    memorability: 'High',
    pronounceability: 'Natural for Indian Market',
    priceEstimate: '₹499 - ₹799 / yr ($6 - $9)',
    recommendedFor: 'Ideal if your primary target clients, government contracts, or vendors are in India.',
    suggestedEmails: ['vashisht@vashishtjoshi.in', 'business@vashishtjoshi.in', 'office@vashishtjoshi.in'],
    badge: 'Popular in India',
    tagline: 'Target Indian Market',
  },
  {
    domain: 'joshiconsulting.com',
    extension: '.com',
    category: 'Consultancy & Advisory',
    appealScore: 94,
    memorability: 'Very High',
    pronounceability: 'Crisp & Authoritative',
    priceEstimate: '₹899 - ₹1,299 / yr',
    recommendedFor: 'Perfect if you provide business consulting, financial advisory, IT services, or client solutions.',
    suggestedEmails: ['vashisht@joshiconsulting.com', 'advisory@joshiconsulting.com', 'clients@joshiconsulting.com'],
    badge: 'High Authority',
    tagline: 'Client Trust & Consulting',
  },
  {
    domain: 'vashishtsolutions.com',
    extension: '.com',
    category: 'Enterprise & Agency',
    appealScore: 92,
    memorability: 'High',
    pronounceability: 'Corporate Sounding',
    priceEstimate: '₹899 - ₹1,299 / yr',
    recommendedFor: 'Great for an agency, B2B services, digital marketing, or enterprise contracts.',
    suggestedEmails: ['vashisht@vashishtsolutions.com', 'projects@vashishtsolutions.com', 'info@vashishtsolutions.com'],
    badge: 'Corporate',
    tagline: 'Full-Service Firm',
  },
  {
    domain: 'joshitech.io',
    extension: '.io',
    category: 'Tech & Digital Startup',
    appealScore: 93,
    memorability: 'Modern',
    pronounceability: 'Silicon Valley Vibe',
    priceEstimate: '₹2,999 - ₹3,999 / yr ($35 - $45)',
    recommendedFor: 'Ideal for tech startups, software developers, AI developers, and SaaS entrepreneurs.',
    suggestedEmails: ['vashisht@joshitech.io', 'dev@joshitech.io', 'team@joshitech.io'],
    badge: 'Tech & Modern',
    tagline: 'Startup & Innovation',
  },
  {
    domain: 'iamvashisht.com',
    extension: '.com',
    category: 'Modern Personal Brand',
    appealScore: 90,
    memorability: 'Memorable',
    pronounceability: 'Short & Punchy',
    priceEstimate: '₹899 - ₹1,299 / yr',
    recommendedFor: 'Great for creators, speakers, freelance professionals, and executive portfolios.',
    suggestedEmails: ['hello@iamvashisht.com', 'mail@iamvashisht.com', 'vashisht@iamvashisht.com'],
    badge: 'Creator / Founder',
    tagline: 'Personal Signature',
  },
  {
    domain: 'vashisht.co',
    extension: '.co',
    category: 'Minimalist & Premium',
    appealScore: 91,
    memorability: 'Ultra Short',
    pronounceability: 'Fast to type',
    priceEstimate: '₹1,999 - ₹2,499 / yr ($25 - $30)',
    recommendedFor: 'Modern boutique company or minimalist personal business card.',
    suggestedEmails: ['hi@vashisht.co', 'vashisht@vashisht.co', 'partner@vashisht.co'],
    badge: 'Premium Minimal',
    tagline: 'Clean & Ultra-Short',
  },
  {
    domain: 'thejoshigroup.com',
    extension: '.com',
    category: 'Group & Holdings',
    appealScore: 89,
    memorability: 'Prestige',
    pronounceability: 'Formal',
    priceEstimate: '₹899 - ₹1,299 / yr',
    recommendedFor: 'Multiple ventures, holding company, trading, exports or family business.',
    suggestedEmails: ['vashisht@thejoshigroup.com', 'director@thejoshigroup.com', 'office@thejoshigroup.com'],
    badge: 'Prestige Group',
    tagline: 'Multi-Ventures',
  },
  {
    domain: 'vashishtdigital.in',
    extension: '.in',
    category: 'Digital Agency',
    appealScore: 88,
    memorability: 'High',
    pronounceability: 'Clear',
    priceEstimate: '₹499 - ₹799 / yr',
    recommendedFor: 'Digital marketing, SEO, web development, content creation, and e-commerce.',
    suggestedEmails: ['vashisht@vashishtdigital.in', 'growth@vashishtdigital.in', 'hello@vashishtdigital.in'],
    badge: 'Agency',
    tagline: 'Digital Growth',
  },
];

// Endpoint: Generate custom domain names for Vashisht Joshi
app.post('/api/generate-domains', async (req, res) => {
  try {
    const { industry = 'General Business', keywords = '', market = 'India & Global' } = req.body;

    if (!ai) {
      // Return enhanced defaults if no API key
      return res.json({ domains: DEFAULT_DOMAINS, source: 'curated' });
    }

    const prompt = `You are an elite business branding consultant and domain naming expert.
A client named "Vashisht Joshi" needs the perfect domain name to register a professional Google Workspace / Gmail business email account.
Notice the exact spelling is "Vashisht Joshi" (not Vashishth).
Industry / Business niche: "${industry}"
Target market: "${market}"
Keywords / Interests: "${keywords}"

Generate an array of 8 to 10 top-tier domain name ideas tailored specifically for Vashisht Joshi.
Requirements:
1. Include exact name variations: e.g. vashishtjoshi.com, vashishtjoshi.in, vashisht.co, iamvashisht.com
2. Include industry-tailored brand names: e.g. joshiconsulting.com, vashisht${industry.toLowerCase().replace(/[^a-z]/g, '')}.com, joshiventures.in, etc.
3. Keep them professional, pronounceable, credible, without confusing hyphens or numbers.
4. Provide estimated Indian rupee / USD annual retail price.
5. Provide 3 recommended professional email prefixes for Google Workspace (e.g., vashisht@domain, contact@domain, hello@domain).

Output strictly valid JSON matching this schema:
{
  "domains": [
    {
      "domain": "string (e.g. vashishtjoshi.com)",
      "extension": "string (e.g. .com or .in)",
      "category": "string (e.g. Exact Personal Brand | Consultancy | Tech Startup)",
      "appealScore": number (80 to 99),
      "memorability": "string (High | Very High | Ultra Short)",
      "pronounceability": "string (e.g. Easy & Global)",
      "priceEstimate": "string (e.g. ₹899 - ₹1,299 / yr ($10 - $14))",
      "recommendedFor": "string (concise reason why this is great for Vashisht)",
      "suggestedEmails": ["string", "string", "string"],
      "badge": "string (e.g. Recommended | Top Pick | Modern Tech | Best in India)",
      "tagline": "string"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);
    return res.json({ domains: parsed.domains || DEFAULT_DOMAINS, source: 'ai' });
  } catch (error: any) {
    console.error('Error generating domains with AI:', error);
    return res.json({ domains: DEFAULT_DOMAINS, source: 'curated_fallback' });
  }
});

// Endpoint: Check real-time DNS status for a domain
app.post('/api/check-domain-dns', async (req, res) => {
  try {
    const { domain } = req.body;
    if (!domain || typeof domain !== 'string') {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const cleanDomain = domain.toLowerCase().trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const result = await checkDnsStatus(cleanDomain);

    const registrarLinks = {
      googleWorkspace: `https://workspace.google.com/intl/en_in/business/`,
      namecheap: `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(cleanDomain)}`,
      godaddy: `https://in.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(cleanDomain)}`,
      hostinger: `https://www.hostinger.in/domain-name-search?domain=${encodeURIComponent(cleanDomain)}`,
    };

    return res.json({
      domain: cleanDomain,
      status: result.status,
      details: result.details,
      registrarLinks,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'Check failed' });
  }
});

// Helper to provide instant smart advisor responses
function getSmartAdvisorResponse(questionText: string, domain: string = 'vashishtjoshi.com') {
  const q = questionText.toLowerCase().trim();

  // Greetings: "hy", "hi", "hello", "hey", "namaste"
  if (/^(hy|hi|hello|hey|namaste|pranam|helo|hii+|hlo)\b/i.test(q) || q.length <= 4) {
    return `नमस्ते वशिष्ठ जी! 🙏 

मैं आपका बिजनेस डोमेन एवं प्रोफेशनल जीमेल सलाहकार हूँ। आप नीचे दिए गए विषयों पर मुझसे कुछ भी पूछ सकते हैं:

1. 🔥 **100% Free बिजनेस ईमेल:** बिना कोई मासिक शुल्क दिए अपने पर्सनल जीमेल में \`vashisht@${domain}\` कैसे चलाएं?
2. 💼 **Zoho Mail Forever Free:** 5 अलग-अलग बिजनेस ईमेल अकाउंट्स 5GB के साथ ₹0 में कैसे पाएं?
3. 🌐 **Google Workspace:** आधिकारिक ₹136/माह प्लान, 30GB क्लाउड और GST इनवॉइसिंग कैसे सेट करें?
4. ⚙️ **Cloudflare & DNS:** MX और SPF रिकॉर्ड्स 2 मिनट में कैसे लिंक करें?

आप क्या जानना चाहते हैं? बस नीचे टाइप करें या बटन्स पर क्लिक करें!`;
  }

  // Free email inquiries
  if (q.includes('free') || q.includes('muft') || q.includes('zero') || q.includes('paise') || q.includes('bina')) {
    return `वशिष्ठ जी, 100% Free बिजनेस ईमेल पाने के दो सबसे बेहतरीन तरीके हैं:

⭐ **तरीका 1 (सबसे लोकप्रिय): Cloudflare Email Routing + Normal Gmail (₹0 Lifetime)**
- **फायदा:** आपको कोई नया ऐप नहीं खोलना होगा। आपके सामान्य पर्सनल Gmail में ही \`vashisht@${domain}\` के मेल आएंगे और वहीं से आप बिजनेस ईमेल बनकर मेल भेज पाएंगे।
- **खर्च:** ₹0 / माह (जीवनभर बिल्कुल फ्री)
- **सेटअप:**
  1. Cloudflare पर फ्री अकाउंट बनाकर अपना डोमेन जोड़ें।
  2. "Email Routing" में जाकर \`vashisht\` को अपने पर्सनल Gmail पर फॉरवर्ड करें।
  3. Google Account में जाकर "App Password" (16 अक्षर) बनाएं।
  4. Gmail Settings → Accounts → "Add another email address" में \`vashisht@${domain}\` जोड़ें (SMTP: \`smtp.gmail.com\`, Port: 587)।

💼 **तरीका 2: Zoho Mail Forever Free Plan**
- 5 बिजनेस ईमेल अकाउंट्स, 5GB स्टोरेज प्रति यूजर, फ्री वेबमेल और मोबाइल ऐप।
- खर्च: ₹0 / माह।

आप ऐप के **"🔥 100% Free Business Email (₹0)"** टैब में जाकर दोनों के डायरेक्ट लिंक्स और DNS रिकॉर्ड्स देख सकते हैं!`;
  }

  // Domain price / .com vs .in
  if (q.includes('.com') || q.includes('.in') || q.includes('price') || q.includes('cost') || q.includes('kharid')) {
    return `वशिष्ठ जी, आपके लिए डोमेन चयन का विश्लेषण:

- **vashishtjoshi.com (अनुशंसित):** यदि आपके क्लाइंट्स भारत के अलावा विदेश में भी हैं, तो \`.com\` सबसे ज्यादा प्रतिष्ठित और विश्वसनीय माना जाता है (कीमत: ₹899 - ₹1,299/वर्ष)।
- **vashishtjoshi.in:** यदि आपका मुख्य व्यापार भारत में है, तो \`.in\` भारतीय ग्राहकों और सरकारी टेंडर्स के लिए बहुत भरोसेमंद है (कीमत: ₹499 - ₹799/वर्ष)।

डोमेन को आप Namecheap, Hostinger या GoDaddy से 1 वर्ष के लिए रजिस्टर कर सकते हैं!`;
  }

  // General fallback
  return `वशिष्ठ जी, आपके नाम से बिजनेस ईमेल (\`vashisht@${domain}\`) को सफलतापूर्वक चलाने के लिए मुख्य बातें:

1. **फ्री तरीका (₹0/माह):** Cloudflare Email Routing द्वारा अपने सामान्य पर्सनल Gmail में ईमेल रिसीव और सेंड करें।
2. **आधिकारिक तरीका (₹136/माह):** Google Workspace Business Starter प्लान लें जिसमें 30GB Google Drive स्टोरेज, Google Meet और एडमिन कंसोल मिलता है।
3. **DNS रिकॉर्ड्स:** अपने डोमेन के DNS में Google MX रिकॉर्ड्स (\`SMTP.GOOGLE.COM\`) या Cloudflare MX रिकॉर्ड्स जोड़ें।

विस्तृत स्टेप्स देखने के लिए ऊपर दिए गए टैब्स का उपयोग करें!`;
}

// Endpoint: AI Business Advisor (Q&A in Hindi / Hinglish / English)
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { question, domain = 'vashishtjoshi.com', conversation = [] } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const cleanQuestion = typeof question === 'string' ? question : '';
    const cleanDomain = typeof domain === 'string' && domain ? domain : 'vashishtjoshi.com';

    // Check if it's a short greeting or known quick query - answer immediately!
    const directAnswer = getSmartAdvisorResponse(cleanQuestion, cleanDomain);

    // If no AI key configured, return high quality smart answer directly
    if (!ai) {
      return res.json({ answer: directAnswer });
    }

    // Try Gemini API with strict 4s timeout
    try {
      const systemInstruction = `You are a friendly, senior Indian Business Branding & IT Infrastructure Consultant advising Vashisht Joshi.
Vashisht Joshi wants a professional custom domain business email (e.g. vashisht@vashishtjoshi.com). Notice the exact spelling of his name is "Vashisht Joshi".
CRITICAL REQUIREMENT: If Vashisht asks for a 100% FREE business email without paying monthly subscription fees:
Explain the 2 legitimate, top free methods clearly in Hindi/Hinglish:
1. Method 1 (100% Free with Gmail): Cloudflare Email Routing + Personal Gmail 'Send mail as' with free Google App Password (smtp.gmail.com). Receive all emails to vashisht@vashishtjoshi.com in his regular Gmail, and send emails with 'From: Vashisht Joshi <vashisht@vashishtjoshi.com>' with ₹0/month lifetime cost!
2. Method 2 (100% Free Dedicated): Zoho Mail Forever Free Plan (upto 5 users, 5GB storage each, free webmail & mobile app, ₹0/month).
Language Style: Warm, encouraging, crystal-clear, bilingual (Hinglish/Hindi + English). Use Indian business context (₹0 free options vs paid Workspace ₹136/mo).
Formatting: Clean, well-structured, bullet points, no fluff. Provide exact actionable instructions.`;

      // Filter conversation so contents strictly alternates and starts with user
      const formattedHistory: any[] = [];
      for (const msg of conversation) {
        if (msg.role === 'user') {
          formattedHistory.push({ role: 'user', parts: [{ text: msg.text || '' }] });
        } else if (msg.role === 'model' && formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === 'user') {
          formattedHistory.push({ role: 'model', parts: [{ text: msg.text || '' }] });
        }
      }

      formattedHistory.push({
        role: 'user',
        parts: [{ text: cleanQuestion }],
      });

      const responsePromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedHistory,
        config: { systemInstruction },
      });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('AI timeout')), 4000)
      );

      const response: any = await Promise.race([responsePromise, timeoutPromise]);
      return res.json({ answer: response.text || directAnswer });
    } catch (aiErr) {
      console.warn('AI call timed out or failed, returning smart fallback:', aiErr);
      return res.json({ answer: directAnswer });
    }
  } catch (error: any) {
    console.error('Advisor error:', error);
    return res.json({
      answer: getSmartAdvisorResponse(req.body?.question || ''),
    });
  }
});

// Vite or Static Serving
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Domain & Business Gmail Suite running at http://localhost:${PORT}`);
});
