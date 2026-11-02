import React, { useState } from 'react';
import {
  Gift,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Server,
  Mail,
  Zap,
  HelpCircle,
  Key,
  Layers,
  Sparkles,
  Send,
  Lock,
} from 'lucide-react';
import { Language } from '../types';

interface FreeEmailGuideProps {
  language: Language;
  selectedDomain: string;
}

export const FreeEmailGuide: React.FC<FreeEmailGuideProps> = ({
  language,
  selectedDomain,
}) => {
  const [activeMethod, setActiveMethod] = useState<'cloudflare' | 'zoho' | 'improvmx'>('cloudflare');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedAllDns, setCopiedAllDns] = useState<boolean>(false);
  const [copiedGuide, setCopiedGuide] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CLOUDFLARE_RECORDS = [
    {
      id: 'cf-mx1',
      type: 'MX',
      host: '@',
      value: 'route1.mx.cloudflare.net',
      priority: '13',
      purpose: 'Cloudflare Free Email Inbound Route 1',
    },
    {
      id: 'cf-mx2',
      type: 'MX',
      host: '@',
      value: 'route2.mx.cloudflare.net',
      priority: '47',
      purpose: 'Cloudflare Free Email Inbound Route 2',
    },
    {
      id: 'cf-mx3',
      type: 'MX',
      host: '@',
      value: 'route3.mx.cloudflare.net',
      priority: '97',
      purpose: 'Cloudflare Free Email Inbound Route 3',
    },
    {
      id: 'cf-spf',
      type: 'TXT',
      host: '@',
      value: 'v=spf1 include:_spf.mx.cloudflare.net ~all',
      priority: '-',
      purpose: 'Cloudflare SPF Authentication for Free Deliverability',
    },
  ];

  const ZOHO_RECORDS = [
    {
      id: 'zoho-mx1',
      type: 'MX',
      host: '@',
      value: 'mx.zoho.in',
      priority: '10',
      purpose: 'Zoho Mail Primary Inbound Server',
    },
    {
      id: 'zoho-mx2',
      type: 'MX',
      host: '@',
      value: 'mx2.zoho.in',
      priority: '20',
      purpose: 'Zoho Mail Secondary Inbound Server',
    },
    {
      id: 'zoho-mx3',
      type: 'MX',
      host: '@',
      value: 'mx3.zoho.in',
      priority: '50',
      purpose: 'Zoho Mail Tertiary Inbound Server',
    },
    {
      id: 'zoho-spf',
      type: 'TXT',
      host: '@',
      value: 'v=spf1 include:zoho.in ~all',
      priority: '-',
      purpose: 'Zoho SPF Verification',
    },
  ];

  const handleCopyAllDns = () => {
    const text = CLOUDFLARE_RECORDS.map(
      (r) => `Type: ${r.type} | Host: ${r.host} | Value: ${r.value} | Priority: ${r.priority}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAllDns(true);
    setTimeout(() => setCopiedAllDns(false), 2500);
  };

  const handleCopyGuide = () => {
    const guideText = `=== Vashisht Joshi - 100% Free Business Email Setup (₹0 Lifetime) ===
Domain: ${selectedDomain}
Email: vashisht@${selectedDomain}

Step 1: Cloudflare.com par free account banayein aur apna domain add karein (Nameservers update karein).
Step 2: Cloudflare Email Routing enable karein aur vashisht@${selectedDomain} ko apne personal @gmail.com par forward karein.
Step 3: Google Account (myaccount.google.com/apppasswords) me jakar 16-digit App Password banayein.
Step 4: Gmail Settings -> Accounts and Import -> Add another email address:
- Name: Vashisht Joshi
- Email: vashisht@${selectedDomain}
- SMTP Server: smtp.gmail.com
- Port: 587 (TLS)
- Username: Aapka personal Gmail ID
- Password: 16-digit App Password

Badhaai ho! Aapka 100% Free business email chalu ho gaya!`;

    navigator.clipboard.writeText(guideText);
    setCopiedGuide(true);
    setTimeout(() => setCopiedGuide(false), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner: 100% Free Lifetime */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-emerald-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold mb-4">
            <Gift className="w-3.5 h-3.5 text-emerald-300" />
            100% Free Lifetime Setup (₹0 / Month Forever)
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {language === 'hindi'
              ? 'बिना 1 रुपया खर्च किए फ्री में बिजनेस ईमेल बनाएं!'
              : 'Create 100% Free Business Email for Vashisht Joshi!'}
          </h2>
          <p className="text-emerald-100/90 text-xs sm:text-base leading-relaxed mb-6">
            {language === 'hindi'
              ? 'अगर आप Google Workspace का ₹136/माह खर्च नहीं करना चाहते, तो आप अपने सामान्य पर्सनल जीमेल (@gmail.com) में ही vashisht@' +
                selectedDomain +
                ' से फ्री में ईमेल भेज और प्राप्त कर सकते हैं!'
              : 'Save money! Send and receive emails directly as vashisht@' +
                selectedDomain +
                ' using your existing free personal Gmail account with zero monthly subscription fees.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-800/80 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>₹0 Monthly Fee (Lifetime)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Send & Receive from Gmail</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Custom Domain Branding</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Method Selection Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveMethod('cloudflare')}
          className={`flex-1 sm:flex-initial py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMethod === 'cloudflare'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Option 1: Free Gmail + Cloudflare (Recommended ⭐)</span>
        </button>

        <button
          onClick={() => setActiveMethod('zoho')}
          className={`flex-1 sm:flex-initial py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMethod === 'zoho'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Server className="w-4 h-4" />
          <span>Option 2: Zoho Mail (Forever Free 5 Users)</span>
        </button>

        <button
          onClick={() => setActiveMethod('improvmx')}
          className={`flex-1 sm:flex-initial py-3 px-5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeMethod === 'improvmx'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25 ring-2 ring-emerald-400/40'
              : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Option 3: ImprovMX (Instant Forwarding)</span>
        </button>
      </div>

      {/* METHOD 1: CLOUDFLARE + FREE GMAIL (CIRCLED IN SCREENSHOT) */}
      {activeMethod === 'cloudflare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  THE BEST FREE METHOD WORLDWIDE
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Personal Gmail + Cloudflare Email Routing (₹0 Lifetime)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  इस तरीके में आपको कोई अलग ऐप डाउनलोड नहीं करना पड़ता। आपके पर्सनल Gmail इनबॉक्स में ही <strong>vashisht@{selectedDomain}</strong> के सारे मेल आएंगे, और आप उसी Gmail से <strong>vashisht@{selectedDomain}</strong> बनकर रिप्लाई भी भेज पाएंगे!
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyGuide}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedGuide ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copiedGuide ? 'Guide Copied!' : 'Copy Complete Guide'}</span>
                </button>

                <a
                  href="https://dash.cloudflare.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  Open Cloudflare (Free)
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* 4 Practical Action Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Step 1 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      1
                    </span>
                    <span>STEP 1: DOMAIN KO CLOUDFLARE PAR ADD KAREIN</span>
                  </div>
                  <a
                    href="https://dash.cloudflare.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Open <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cloudflare.com पर फ्री अकाउंट बनाएं। अपना डोमेन (<strong>{selectedDomain}</strong>) डालें और 'Free Plan' चुनें। अपने डोमेन रजिस्ट्रार (Namecheap/GoDaddy) में Cloudflare के नेमसर्वर्स (Nameservers) अपडेट करें।
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      2
                    </span>
                    <span>STEP 2: EMAIL ROUTING CHALU KAREIN (RECEIVE)</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                    Receive 100% Free
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cloudflare डैशबोर्ड में <strong>Email Routing</strong> पर क्लिक करें। Custom Address में <strong>vashisht</strong> लिखें और Destination में अपना व्यक्तिगत <strong>@gmail.com</strong> एड्रेस जोड़ें। अब आने वाले सभी ईमेल आपके जीमेल में आएंगे!
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      3
                    </span>
                    <span>STEP 3: GOOGLE APP PASSWORD GENERATE KAREIN</span>
                  </div>
                  <a
                    href="https://myaccount.google.com/apppasswords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Google Passwords <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  अपने गूगल अकाउंट पर जाएं (myaccount.google.com) → Security → 2-Step Verification चालू करें → नीचे <strong>App Passwords</strong> पर क्लिक करें और 'Mail' नाम देकर 16-अक्षरों का पासवर्ड कॉपी कर लें।
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px]">
                      4
                    </span>
                    <span>STEP 4: GMAIL ME 'SEND MAIL AS' SET KAREIN</span>
                  </div>
                  <a
                    href="https://mail.google.com/mail/u/0/#settings/accounts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                  >
                    Gmail Settings <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Gmail Settings ⚙️ → Accounts and Import → <strong>Add another email address</strong> → नाम में <strong>Vashisht Joshi</strong> और ईमेल में <strong>vashisht@{selectedDomain}</strong> डालें। SMTP Server: <code>smtp.gmail.com</code>, Port: <code>587</code>, और Step 3 का 16-डिजिट पासवर्ड पेस्ट कर दें!
                </p>
              </div>
            </div>

            {/* Cloudflare DNS Records Table */}
            <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">
                    Cloudflare Free Email Routing DNS Records ({selectedDomain})
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Add these records inside your Cloudflare DNS Management tab
                  </span>
                </div>

                <button
                  onClick={handleCopyAllDns}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedAllDns ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAllDns ? 'All Records Copied!' : 'Copy All Records'}</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Type</th>
                      <th className="py-3 px-4">Host</th>
                      <th className="py-3 px-4">Value</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {CLOUDFLARE_RECORDS.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-bold text-emerald-700">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                            {rec.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-semibold">{rec.host}</td>
                        <td className="py-3 px-4 break-all text-slate-900 font-medium">
                          {rec.value}
                        </td>
                        <td className="py-3 px-4">{rec.priority}</td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => copyToClipboard(rec.value, rec.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-white text-slate-700 text-xs font-sans font-semibold transition-all cursor-pointer shadow-2xs"
                          >
                            {copiedKey === rec.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{copiedKey === rec.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 2: ZOHO MAIL FOREVER FREE */}
      {activeMethod === 'zoho' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Dedicated Business Inbox (5 Users Free)
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Zoho Mail Forever Free Plan (₹0 Lifetime)
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  Zoho Mail आपको 5 बिजनेस ईमेल (जैसे <code>vashisht@{selectedDomain}</code>, <code>contact@{selectedDomain}</code>) 5GB स्टोरेज के साथ बिल्कुल फ्री प्रदान करता है। इसका अपना वेबमेल और मोबाइल ऐप भी फ्री है।
                </p>
              </div>

              <a
                href="https://www.zoho.com/mail/zohomail-pricing.html"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
              >
                Go to Zoho Forever Free Plan
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 leading-relaxed mb-6">
              <strong>Zoho Free Plan ढूँढने का तरीका:</strong> Zoho Mail pricing पेज पर नीचे स्क्रॉल करें, आपको सबसे नीचे <em>"Forever Free Plan - Up to 5 users, 5GB/User, Free Webmail"</em> का छोटा लिंक मिलेगा। 'Sign Up' पर क्लिक करें और अपना डोमेन <strong>{selectedDomain}</strong> कनेक्ट करें।
            </div>

            {/* Zoho DNS Records Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="bg-slate-100/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  Zoho Mail Free DNS Records ({selectedDomain})
                </span>
                <span className="text-[11px] text-slate-500">Paste in your Domain DNS Manager</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold text-[11px]">
                    <tr>
                      <th className="py-2.5 px-4">Type</th>
                      <th className="py-2.5 px-4">Host</th>
                      <th className="py-2.5 px-4">Value</th>
                      <th className="py-2.5 px-4">Priority</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
                    {ZOHO_RECORDS.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 font-bold text-blue-700">{rec.type}</td>
                        <td className="py-2.5 px-4">{rec.host}</td>
                        <td className="py-2.5 px-4 break-all">{rec.value}</td>
                        <td className="py-2.5 px-4">{rec.priority}</td>
                        <td className="py-2.5 px-4 text-right">
                          <button
                            onClick={() => copyToClipboard(rec.value, rec.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 hover:bg-white text-slate-700 text-xs font-sans font-medium cursor-pointer"
                          >
                            {copiedKey === rec.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{copiedKey === rec.id ? 'Copied' : 'Copy'}</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* METHOD 3: IMPROVMX */}
      {activeMethod === 'improvmx' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Instant 2-Minute Setup
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-2">
                ImprovMX Free Forwarding (₹0)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
                बिना कोई अकाउंट या पासवर्ड बनाए, सिर्फ 2 मिनट में अपने डोमेन के सभी मेल अपने पर्सनल जीमेल पर फॉरवर्ड करें।
              </p>
            </div>

            <a
              href="https://improvmx.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              Open ImprovMX
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700 pt-2">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong>MX 1:</strong> <code>mx1.improvmx.com</code> (Priority: 10)
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <strong>MX 2:</strong> <code>mx2.improvmx.com</code> (Priority: 20)
            </div>
          </div>
        </div>
      )}

      {/* Cost Comparison Summary Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">
          Kharch Ki Tulna (Cost Comparison: Free vs Paid):
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 uppercase font-semibold text-[11px]">
              <tr>
                <th className="py-3 px-4">Plan / Provider</th>
                <th className="py-3 px-4">Monthly Cost</th>
                <th className="py-3 px-4">Yearly Cost</th>
                <th className="py-3 px-4">Gmail Interface?</th>
                <th className="py-3 px-4">Best For</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr className="bg-emerald-50/70 font-semibold text-emerald-950">
                <td className="py-3 px-4 flex items-center gap-1.5">
                  <Gift className="w-4 h-4 text-emerald-600" />
                  <span>Cloudflare + Personal Gmail</span>
                </td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹0 / month</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹0 / year</td>
                <td className="py-3 px-4">Yes (Directly in normal Gmail)</td>
                <td className="py-3 px-4">100% Free start for Vashisht Joshi</td>
              </tr>
              <tr className="hover:bg-slate-50">
                <td className="py-3 px-4 font-semibold text-blue-900">Zoho Mail Forever Free</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹0 / month</td>
                <td className="py-3 px-4 text-emerald-700 font-bold">₹0 / year</td>
                <td className="py-3 px-4">Zoho Webmail & App (Free)</td>
                <td className="py-3 px-4">5 Separate business accounts</td>
              </tr>
              <tr className="hover:bg-slate-50 text-slate-500">
                <td className="py-3 px-4">Google Workspace (Paid)</td>
                <td className="py-3 px-4 font-medium text-slate-900">₹136 / month</td>
                <td className="py-3 px-4 font-medium text-slate-900">₹1,632 / year</td>
                <td className="py-3 px-4">Yes (Official Google Workspace)</td>
                <td className="py-3 px-4">Corporates with high budget</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
