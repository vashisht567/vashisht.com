import React, { useState } from 'react';
import {
  Mail,
  Send,
  Star,
  Clock,
  Trash2,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  Paperclip,
  Image as ImageIcon,
  MoreVertical,
  CornerUpLeft,
  User,
  Inbox,
  SendHorizontal,
  FileText,
  Video,
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface GmailSimulatorProps {
  language: Language;
  selectedDomain: string;
}

export const GmailSimulator: React.FC<GmailSimulatorProps> = ({
  language,
  selectedDomain,
}) => {
  const t = TRANSLATIONS[language];
  const [emailPrefix, setEmailPrefix] = useState<string>('vashisht');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'compose'>('preview');

  // Custom email state
  const fullEmail = `${emailPrefix || 'vashisht'}@${selectedDomain}`;

  // Compose state
  const [composeTo, setComposeTo] = useState<string>('client.executive@tata.com');
  const [composeSubject, setComposeSubject] = useState<string>(
    'Project Discussion & Commercial Proposal - Joshi Consulting'
  );
  const [composeMessage, setComposeMessage] = useState<string>(
    `Dear Client Team,

Thank you for your interest in our services. I am pleased to share the project outline and commercial proposal for our upcoming collaboration.

Please review the attached scope of work. Let me know if you would like to schedule a brief Google Meet to finalize the kickoff date.

Warm regards,
Vashisht Joshi
Founder & Principal Consultant
${selectedDomain}`
  );

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(fullEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Controller: Prefix selector & Active Address */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'hindi'
              ? 'अपना प्रोफेशनल जीमेल एड्रेस कस्टमाइज़ करें'
              : 'Customize Your Professional Business Gmail Address'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mb-5">
            {language === 'hindi'
              ? 'गूगल वर्कस्पेस में आप अपने डोमेन पर कोई भी ईमेल प्रीफिक्स बना सकते हैं:'
              : 'With Google Workspace, you can create multiple executive or departmental aliases on your domain:'}
          </p>

          {/* Preset prefix buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { id: 'vashisht', label: 'vashisht@ (Founder/Personal)', desc: 'Best for direct client trust' },
              { id: 'contact', label: 'contact@ (Inquiries)', desc: 'General business inquiries' },
              { id: 'founder', label: 'founder@ (Executive)', desc: 'High prestige for partnerships' },
              { id: 'office', label: 'office@ (Corporate)', desc: 'Formal administrative desk' },
              { id: 'hello', label: 'hello@ (Modern / Friendly)', desc: 'Startup and agency friendly' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setEmailPrefix(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  emailPrefix === item.id
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Custom Input & Output Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-slate-500 font-medium">Prefix:</span>
              <input
                type="text"
                value={emailPrefix}
                onChange={(e) => setEmailPrefix(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''))}
                placeholder="vashisht"
                className="w-36 px-2.5 py-1 text-sm font-mono font-semibold rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
              />
              <span className="text-sm font-mono font-semibold text-slate-700">@{selectedDomain}</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-100/70 border border-emerald-300/60 rounded-lg text-emerald-900 text-xs font-mono font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {fullEmail}
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copied : 'Copy Email'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison: Free Casual @gmail.com vs Professional Google Workspace */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">{t.comparisonTitle}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Free Email Card */}
          <div className="p-4 rounded-xl border border-red-200 bg-red-50/40">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm mb-2">
              <XCircle className="w-4 h-4 text-red-500" />
              <span>{t.casualEmail}: vashisht.joshi928@gmail.com</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>{t.casualPoint1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>{t.casualPoint2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>{t.casualPoint3}</span>
              </li>
            </ul>
          </div>

          {/* Google Workspace Business Email Card */}
          <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{t.proEmail}: {fullEmail}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t.proPoint1}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t.proPoint2}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>{t.proPoint3}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Realistic Google Workspace Gmail UI Mockup */}
      <div className="rounded-2xl border border-slate-300 bg-white overflow-hidden shadow-lg">
        {/* Gmail App Top Bar */}
        <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Google Workspace Logo Simulator */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-5 flex items-center justify-center">
                <span className="text-red-500 font-extrabold text-sm tracking-tighter">G</span>
                <span className="text-blue-500 font-extrabold text-sm tracking-tighter">m</span>
                <span className="text-amber-500 font-extrabold text-sm tracking-tighter">a</span>
                <span className="text-green-500 font-extrabold text-sm tracking-tighter">i</span>
                <span className="text-blue-500 font-extrabold text-sm tracking-tighter">l</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 pl-1 border-l border-slate-300">
                Workspace
              </span>
            </div>

            {/* Fake Search Bar */}
            <div className="hidden sm:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-slate-200 text-xs text-slate-400 w-64 md:w-80 shadow-2xs">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Search in mail</span>
            </div>
          </div>

          {/* User Profile Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 hidden md:inline">
              Vashisht Joshi
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center ring-2 ring-indigo-200">
              VJ
            </div>
          </div>
        </div>

        {/* Gmail Main Window Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 min-h-[460px]">
          {/* Left Sidebar */}
          <div className="md:col-span-3 border-r border-slate-200 bg-slate-50/60 p-3 space-y-3">
            {/* Compose Button */}
            <button
              onClick={() => setActiveTab('compose')}
              className={`w-full py-2.5 px-4 rounded-2xl flex items-center gap-3 text-xs font-semibold shadow-xs transition-all cursor-pointer ${
                activeTab === 'compose'
                  ? 'bg-blue-600 text-white shadow-blue-500/20'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                +
              </div>
              <span>Compose Email</span>
            </button>

            {/* Folder list */}
            <div className="space-y-0.5 text-xs font-medium text-slate-700">
              <button
                onClick={() => setActiveTab('preview')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer ${
                  activeTab === 'preview'
                    ? 'bg-blue-100/70 text-blue-800 font-bold'
                    : 'hover:bg-slate-200/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Inbox className="w-4 h-4 text-blue-600" />
                  <span>Inbox</span>
                </div>
                <span className="text-[11px] font-bold text-blue-700">1</span>
              </button>
              <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:bg-slate-200/50 rounded-lg cursor-pointer">
                <Star className="w-4 h-4 text-slate-400" />
                <span>Starred</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:bg-slate-200/50 rounded-lg cursor-pointer">
                <SendHorizontal className="w-4 h-4 text-slate-400" />
                <span>Sent</span>
              </div>
              <div className="flex items-center gap-2.5 px-3 py-2 text-slate-500 hover:bg-slate-200/50 rounded-lg cursor-pointer">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Drafts</span>
              </div>
            </div>

            {/* Google Meet shortcut */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-[11px] font-semibold text-slate-400 px-3 uppercase tracking-wider mb-2">
                Google Workspace
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Join or Start Meet</span>
              </div>
            </div>
          </div>

          {/* Right Content Area: Email View or Interactive Compose */}
          <div className="md:col-span-9 p-5 flex flex-col justify-between bg-white">
            {activeTab === 'preview' ? (
              <div className="space-y-4">
                {/* Subject & Controls */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="text-base sm:text-lg font-bold text-slate-900">
                    Client Proposal & Enterprise Agreement
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Google SPF/DKIM Verified
                    </span>
                  </div>
                </div>

                {/* Sender Details Header */}
                <div className="flex items-start justify-between gap-3 bg-slate-50/70 p-3.5 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      VJ
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">Vashisht Joshi</span>
                        <span className="font-mono text-xs text-blue-700 font-semibold">
                          &lt;{fullEmail}&gt;
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        to: <span className="text-slate-700">partner.board@acme-corp.com</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400">Today, 10:45 AM</span>
                </div>

                {/* Email Body Content */}
                <div className="text-xs sm:text-sm text-slate-700 space-y-3 leading-relaxed py-2">
                  <p>Dear Partner,</p>
                  <p>
                    I hope this message finds you well. Following our strategic discussion, I am pleased to share the project outline and commercial proposal from our firm.
                  </p>
                  <p>
                    Because this email is routed through our verified corporate Google Workspace server at <strong>{selectedDomain}</strong>, all attachments and communications are encrypted under Google’s enterprise security framework.
                  </p>
                  <p>
                    Please review the deliverables and let us know your availability for a Google Meet briefing this Thursday.
                  </p>
                </div>

                {/* Signature preview in email */}
                <div className="pt-4 border-t border-slate-200 space-y-1 text-xs">
                  <div className="font-bold text-slate-900">Vashisht Joshi</div>
                  <div className="text-slate-600 font-medium">Founder & Director • Joshi Consulting</div>
                  <div className="text-blue-600 font-mono">{fullEmail}</div>
                  <div className="text-slate-500 font-mono">www.{selectedDomain}</div>
                </div>
              </div>
            ) : (
              /* Compose view */
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    New Message (Sent via {fullEmail})
                  </span>
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Close
                  </button>
                </div>

                {/* Recipient */}
                <div className="flex items-center gap-2 border-b border-slate-100 py-1.5 text-xs">
                  <span className="text-slate-400 w-12">To:</span>
                  <input
                    type="text"
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    className="flex-1 focus:outline-none text-slate-800"
                  />
                </div>

                {/* Subject */}
                <div className="flex items-center gap-2 border-b border-slate-100 py-1.5 text-xs">
                  <span className="text-slate-400 w-12">Subject:</span>
                  <input
                    type="text"
                    value={composeSubject}
                    onChange={(e) => setComposeSubject(e.target.value)}
                    className="flex-1 focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                {/* Message textarea */}
                <textarea
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  rows={8}
                  className="w-full text-xs sm:text-sm text-slate-700 focus:outline-none resize-none leading-relaxed"
                />

                {/* Bottom send action */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <button
                    onClick={() => {
                      alert(`Mock Email sent from ${fullEmail} to ${composeTo}! In real life, this is handled through your Google Workspace.`);
                      setActiveTab('preview');
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Email
                  </button>

                  <div className="flex items-center gap-3 text-slate-400 text-xs">
                    <Paperclip className="w-4 h-4 cursor-pointer hover:text-slate-600" />
                    <ImageIcon className="w-4 h-4 cursor-pointer hover:text-slate-600" />
                    <Trash2
                      onClick={() => setActiveTab('preview')}
                      className="w-4 h-4 cursor-pointer hover:text-red-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
