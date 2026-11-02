import React, { useState } from 'react';
import {
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Briefcase,
  Phone,
  Mail,
  Globe,
  MapPin,
  Settings,
} from 'lucide-react';
import { SignatureData, Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface SignatureBuilderProps {
  language: Language;
  selectedDomain: string;
}

export const SignatureBuilder: React.FC<SignatureBuilderProps> = ({
  language,
  selectedDomain,
}) => {
  const t = TRANSLATIONS[language];
  const [copiedRich, setCopiedRich] = useState<boolean>(false);
  const [copiedHtml, setCopiedHtml] = useState<boolean>(false);

  const [sig, setSig] = useState<SignatureData>({
    fullName: 'Vashisht Joshi',
    title: 'Founder & Managing Director',
    company: 'Joshi Consulting & Solutions',
    phone: '+91 98765 43210',
    email: `vashisht@${selectedDomain}`,
    website: `www.${selectedDomain}`,
    location: 'Mumbai & Ahmedabad, India',
    themeColor: '#2563eb', // royal blue
    style: 'modern',
  });

  // Sync email & website when selected domain changes
  React.useEffect(() => {
    setSig((prev) => ({
      ...prev,
      email: `vashisht@${selectedDomain}`,
      website: `www.${selectedDomain}`,
    }));
  }, [selectedDomain]);

  // Generate plain HTML representation
  const generateRawHtml = () => {
    return `<div style="font-family: Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #1e293b; max-width: 480px;">
  <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
    <tr>
      <td style="padding-right: 16px; border-right: 3px solid ${sig.themeColor}; vertical-align: top;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background-color: ${sig.themeColor}; color: #ffffff; font-weight: bold; font-size: 16px; line-height: 44px; text-align: center;">
          VJ
        </div>
      </td>
      <td style="padding-left: 16px; vertical-align: top;">
        <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 2px;">
          ${sig.fullName}
        </div>
        <div style="font-size: 12px; color: #475569; font-weight: 600; margin-bottom: 6px;">
          ${sig.title} | <span style="color: ${sig.themeColor};">${sig.company}</span>
        </div>
        <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
          📞 <a href="tel:${sig.phone}" style="color: #475569; text-decoration: none;">${sig.phone}</a><br/>
          ✉️ <a href="mailto:${sig.email}" style="color: ${sig.themeColor}; font-weight: bold; text-decoration: none;">${sig.email}</a><br/>
          🌐 <a href="https://${sig.website}" style="color: #475569; text-decoration: none;">${sig.website}</a><br/>
          📍 <span style="color: #64748b;">${sig.location}</span>
        </div>
      </td>
    </tr>
  </table>
</div>`;
  };

  // Copy formatted rich text for direct paste into Gmail settings
  const handleCopyRich = async () => {
    try {
      const html = generateRawHtml();
      const blob = new Blob([html], { type: 'text/html' });
      const textBlob = new Blob(
        [
          `${sig.fullName}\n${sig.title} | ${sig.company}\nPhone: ${sig.phone}\nEmail: ${sig.email}\nWebsite: ${sig.website}`,
        ],
        { type: 'text/plain' }
      );

      const item = new ClipboardItem({
        'text/html': blob,
        'text/plain': textBlob,
      });

      await navigator.clipboard.write([item]);
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 2500);
    } catch (err) {
      // Fallback
      navigator.clipboard.writeText(generateRawHtml());
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 2500);
    }
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(generateRawHtml());
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Intro */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {language === 'hindi'
            ? 'प्रोफेशनल जीमेल सिग्नेचर जनरेटर'
            : 'Professional Gmail Email Signature Builder'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {language === 'hindi'
            ? 'जब आप अपने नए बिजनेस ईमेल (@vashishtjoshi.com) से मेल भेजेंगे, तो नीचे दिया गया सुंदर सिग्नेचर हर ईमेल के अंत में स्वतः दिखाई देगा। इसे एक क्लिक में कॉपी करके जीमेल सेटिंग्स में पेस्ट करें।'
            : 'Add a high-trust executive signature to your new business Gmail account. When clients read your emails, this polished signature reinforces your company credibility.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Details customization */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Edit Signature Details
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-medium mb-1">Full Name:</label>
              <input
                type="text"
                value={sig.fullName}
                onChange={(e) => setSig({ ...sig, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Designation / Title:</label>
              <input
                type="text"
                value={sig.title}
                onChange={(e) => setSig({ ...sig, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Company / Brand Name:</label>
              <input
                type="text"
                value={sig.company}
                onChange={(e) => setSig({ ...sig, company: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Phone Number:</label>
              <input
                type="text"
                value={sig.phone}
                onChange={(e) => setSig({ ...sig, phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Business Email:</label>
              <input
                type="text"
                value={sig.email}
                onChange={(e) => setSig({ ...sig, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Website URL:</label>
              <input
                type="text"
                value={sig.website}
                onChange={(e) => setSig({ ...sig, website: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-medium mb-1">Location / Office:</label>
              <input
                type="text"
                value={sig.location}
                onChange={(e) => setSig({ ...sig, location: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Accent color picker */}
            <div>
              <label className="block text-slate-600 font-medium mb-1">Accent Theme Color:</label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'Royal Blue', hex: '#2563eb' },
                  { name: 'Indigo', hex: '#4f46e5' },
                  { name: 'Emerald', hex: '#059669' },
                  { name: 'Slate Dark', hex: '#0f172a' },
                  { name: 'Crimson', hex: '#dc2626' },
                ].map((color) => (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSig({ ...sig, themeColor: color.hex })}
                    style={{ backgroundColor: color.hex }}
                    className={`w-7 h-7 rounded-full cursor-pointer transition-transform ${
                      sig.themeColor === color.hex ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : ''
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Action Area */}
        <div className="lg:col-span-7 space-y-5">
          {/* Live Signature Box */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Live Signature Preview
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                Ready to Paste into Gmail
              </span>
            </div>

            {/* Rendered Signature Canvas */}
            <div className="p-6 rounded-xl border border-dashed border-slate-300 bg-slate-50/50">
              <div className="flex items-start gap-4">
                {/* Avatar Badge */}
                <div
                  style={{ backgroundColor: sig.themeColor }}
                  className="w-12 h-12 rounded-full text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm"
                >
                  VJ
                </div>

                {/* Vertical Divider */}
                <div
                  style={{ backgroundColor: sig.themeColor }}
                  className="w-0.5 self-stretch rounded-full"
                />

                {/* Signature Content */}
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 leading-tight">
                    {sig.fullName}
                  </h4>
                  <p className="text-xs text-slate-600 font-semibold">
                    {sig.title} | <span style={{ color: sig.themeColor }}>{sig.company}</span>
                  </p>

                  <div className="pt-2 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sig.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span className="font-semibold text-blue-600 font-mono">{sig.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono text-slate-700">{sig.website}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{sig.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-5">
              <button
                onClick={handleCopyRich}
                className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-blue-500/20 cursor-pointer"
              >
                {copiedRich ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                {copiedRich ? 'Formatted Signature Copied!' : 'Copy Signature for Gmail'}
              </button>

              <button
                onClick={handleCopyHtml}
                className="py-2.5 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedHtml ? 'HTML Copied' : 'Copy HTML Code'}
              </button>
            </div>
          </div>

          {/* Step-by-step how to paste in Gmail */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Settings className="w-4 h-4 text-blue-400" />
              <h4 className="text-sm font-bold text-white">
                {language === 'hindi'
                  ? 'Gmail में सिग्नेचर कैसे जोड़ें (3 आसान स्टेप्स):'
                  : 'How to Paste This Signature in Gmail (3 Simple Steps):'}
              </h4>
            </div>

            <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
              <li>
                {language === 'hindi'
                  ? 'अपने Gmail अकाउंट में ऊपर दाईं ओर सेटिंग्स आइकन (⚙️) पर क्लिक करें और "See all settings" चुनें।'
                  : 'In your Gmail account, click the Settings gear icon (⚙️) on top right and click "See all settings".'}
              </li>
              <li>
                {language === 'hindi'
                  ? '"General" टैब में नीचे स्क्रॉल करें और "Signature" सेक्शन में "+ Create new" दबाएं।'
                  : 'Under the "General" tab, scroll down to the "Signature" section and click "+ Create new".'}
              </li>
              <li>
                {language === 'hindi'
                  ? 'ऊपर दिए गए बटन से "Copy Signature" करें और सिग्नेचर बॉक्स में सीधा Ctrl+V (Paste) कर दें, फिर नीचे "Save Changes" दबाएं।'
                  : 'Click the "Copy Signature for Gmail" button above and paste (Ctrl+V) directly into the signature box, then click "Save Changes" at the bottom.'}
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
