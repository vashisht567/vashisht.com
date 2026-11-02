import React, { useState } from 'react';
import {
  ShieldCheck,
  Copy,
  Check,
  Server,
  Key,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface DnsGuideProps {
  language: Language;
  selectedDomain: string;
}

export const DnsGuide: React.FC<DnsGuideProps> = ({
  language,
  selectedDomain,
}) => {
  const t = TRANSLATIONS[language];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const DNS_RECORDS = [
    {
      id: 'mx',
      type: 'MX',
      host: '@',
      value: 'SMTP.GOOGLE.COM.',
      priority: '1',
      ttl: '3600 (1 hour)',
      purpose:
        language === 'hindi'
          ? 'गूगल के मेल सर्वर को सक्रिय करता है ताकि सभी ईमेल आपके जीमेल इनबॉक्स में आएं।'
          : 'Directs all incoming email traffic directly to Google’s high-reliability Gmail servers.',
      critical: true,
    },
    {
      id: 'spf',
      type: 'TXT',
      host: '@',
      value: 'v=spf1 include:_spf.google.com ~all',
      priority: '-',
      ttl: '3600',
      purpose:
        language === 'hindi'
          ? 'स्पैम सुरक्षा (SPF): यह साबित करता है कि ईमेल वास्तव में आपके द्वारा ही भेजा गया है, फर्जी स्पैमर द्वारा नहीं।'
          : 'Sender Policy Framework: Authenticates that Google servers have legitimate authority to send emails from your domain.',
      critical: true,
    },
    {
      id: 'dkim',
      type: 'TXT',
      host: 'google._domainkey',
      value: 'v=DKIM1; k=rsa; p=YOUR_UNIQUE_PUBLIC_KEY_FROM_WORKSPACE_ADMIN',
      priority: '-',
      ttl: '3600',
      purpose:
        language === 'hindi'
          ? 'डिजिटल सिग्नेचर (DKIM): गूगल वर्कस्पेस एडमिन कंसोल से जनरेट होती है ताकि कोई ईमेल में छेड़छाड़ न कर सके।'
          : 'DomainKeys Identified Mail: Adds a tamper-proof cryptographic signature to each outgoing message.',
      critical: false,
    },
    {
      id: 'dmarc',
      type: 'TXT',
      host: '_dmarc',
      value: 'v=DMARC1; p=quarantine; sp=quarantine; pct=100;',
      priority: '-',
      ttl: '3600',
      purpose:
        language === 'hindi'
          ? 'DMARC पॉलिसी: अगर कोई आपके डोमेन के नाम से फर्जी मेल भेजने की कोशिश करे, तो वह रिजेक्ट हो जाएगा।'
          : 'DMARC Policy: Instructs receiving servers to quarantine unverified spoofed emails impersonating your name.',
      critical: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              100% Google Workspace Architecture
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">
              {language === 'hindi'
                ? `डोमेन ${selectedDomain} पर गूगल वर्कस्पेस सेटअप गाइड`
                : `Google Workspace Setup Blueprint for ${selectedDomain}`}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              {language === 'hindi'
                ? 'डोमेन खरीदने से लेकर अपना पहला पेशेवर ईमेल भेजने तक का 4-स्टेप्स का कम्पलीट रोडमैप। नीचे दिए गए DNS रिकॉर्ड्स को अपने रजिस्ट्रार के DNS पैनल में जोड़ें।'
                : 'Follow this 4-step roadmap to connect your custom domain to Google Workspace and ensure 100% inbox delivery.'}
            </p>
          </div>

          <a
            href="https://workspace.google.com/intl/en_in/business/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
          >
            Open Google Workspace
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* 4-Step Visual Roadmap */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            step: '01',
            title: language === 'hindi' ? 'डोमेन खरीदें' : 'Register Domain',
            desc:
              language === 'hindi'
                ? 'Namecheap, Hostinger या सीधे Google Workspace से अपना डोमेन बुक करें।'
                : 'Purchase your desired domain (e.g. via Namecheap, GoDaddy, Hostinger, or Google directly).',
          },
          {
            step: '02',
            title: language === 'hindi' ? 'Google Workspace प्लान' : 'Select Plan',
            desc:
              language === 'hindi'
                ? 'Business Starter प्लान चुनें (लगभग ₹136/माह, 30GB क्लाउड और मीट के साथ)।'
                : 'Choose Google Workspace Business Starter (~₹136/mo in India / $6/mo globally).',
          },
          {
            step: '03',
            title: language === 'hindi' ? 'DNS MX रिकॉर्ड्स' : 'Configure MX',
            desc:
              language === 'hindi'
                ? 'नीचे दिए गए MX और SPF रिकॉर्ड्स को अपने डोमेन DNS मैनेजमेंट में कॉपी-पेस्ट करें।'
                : 'Copy Google MX & SPF records into your domain DNS manager (e.g., Cloudflare, GoDaddy).',
          },
          {
            step: '04',
            title: language === 'hindi' ? 'जीमेल शुरू!' : 'Login & Send',
            desc:
              language === 'hindi'
                ? 'अपने नए ईमेल (vashisht@' +
                  selectedDomain +
                  ') से सामान्य mail.google.com पर लॉगिन करें।'
                : `Log in at mail.google.com with your custom email vashisht@${selectedDomain}!`,
          },
        ].map((item, idx) => (
          <div
            key={item.step}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs relative overflow-hidden"
          >
            <div className="text-3xl font-extrabold text-slate-100 absolute top-2 right-3 pointer-events-none">
              {item.step}
            </div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-bold text-xs flex items-center justify-center mb-3">
              {item.step}
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">{item.title}</h4>
            <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Copyable DNS Records Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'hindi'
                ? `डोमेन DNS रिकॉर्ड्स (Domain: ${selectedDomain})`
                : `Official Google Workspace DNS Records (${selectedDomain})`}
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Click copy icon to copy values</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Host Name</th>
                <th className="py-3 px-4">Value / Destination</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {DNS_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-700">
                    <span className="px-2 py-0.5 rounded bg-blue-50 border border-blue-200/60">
                      {record.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">{record.host}</td>
                  <td className="py-3.5 px-4 font-mono font-medium max-w-xs break-all">
                    {record.value}
                  </td>
                  <td className="py-3.5 px-4 font-mono">{record.priority}</td>
                  <td className="py-3.5 px-4 text-slate-500 max-w-xs leading-relaxed">
                    {record.purpose}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => copyToClipboard(record.value, record.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                    >
                      {copiedKey === record.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy Value</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deliverability & Anti-Spam Tips */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Important Deliverability Pro-Tip for Vashisht Joshi:</span>
        </div>
        <p className="leading-relaxed">
          {language === 'hindi'
            ? 'जब आप नया डोमेन लेते हैं, तो पहले सप्ताह में एक साथ 100+ बल्क ईमेल न भेजें। रोजाना 10-20 सामान्य ईमेल से शुरुआत करें ताकि डोमेन का "Reputation Score" गूगल और माइक्रोसॉफ्ट के फिल्टर में हाई हो जाए।'
            : 'When launching your brand new domain, avoid sending bulk cold emails immediately during the first week. Start by sending 10-20 genuine business emails per day to establish a pristine reputation score across Google and Microsoft email filters.'}
        </p>
      </div>
    </div>
  );
};
