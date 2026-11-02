import React, { useState } from 'react';
import {
  Globe,
  Mail,
  FileSignature,
  FileCode2,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Gift,
} from 'lucide-react';
import { Header } from './components/Header';
import { DomainExplorer } from './components/DomainExplorer';
import { FreeEmailGuide } from './components/FreeEmailGuide';
import { GmailSimulator } from './components/GmailSimulator';
import { SignatureBuilder } from './components/SignatureBuilder';
import { DnsGuide } from './components/DnsGuide';
import { AiAdvisor } from './components/AiAdvisor';
import { Language } from './types';
import { TRANSLATIONS } from './data/translations';

export default function App() {
  const [language, setLanguage] = useState<Language>('hinglish');
  const [selectedDomain, setSelectedDomain] = useState<string>('vashishtjoshi.com');
  const [activeTab, setActiveTab] = useState<
    'domains' | 'freeEmail' | 'preview' | 'signature' | 'setupGuide' | 'aiAdvisor'
  >('freeEmail'); // Directly opened to satisfy user request!

  const t = TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        selectedDomain={selectedDomain}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="bg-white rounded-xl p-1.5 border border-slate-200 shadow-xs mb-8 flex items-center gap-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('domains')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'domains'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{t.tabs.domains}</span>
          </button>

          {/* 100% Free Email Tab */}
          <button
            onClick={() => setActiveTab('freeEmail')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'freeEmail'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
            }`}
          >
            <Gift className="w-4 h-4 text-amber-300" />
            <span>{t.tabs.freeEmail}</span>
          </button>

          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>{t.tabs.preview}</span>
          </button>

          <button
            onClick={() => setActiveTab('signature')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'signature'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileSignature className="w-4 h-4" />
            <span>{t.tabs.signature}</span>
          </button>

          <button
            onClick={() => setActiveTab('setupGuide')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'setupGuide'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>{t.tabs.setupGuide}</span>
          </button>

          <button
            onClick={() => setActiveTab('aiAdvisor')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'aiAdvisor'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>{t.tabs.aiAdvisor}</span>
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'domains' && (
          <DomainExplorer
            language={language}
            selectedDomain={selectedDomain}
            onSelectDomain={(domain) => {
              setSelectedDomain(domain);
            }}
            onNavigateToPreview={() => setActiveTab('freeEmail')}
          />
        )}

        {activeTab === 'freeEmail' && (
          <FreeEmailGuide
            language={language}
            selectedDomain={selectedDomain}
          />
        )}

        {activeTab === 'preview' && (
          <GmailSimulator
            language={language}
            selectedDomain={selectedDomain}
          />
        )}

        {activeTab === 'signature' && (
          <SignatureBuilder
            language={language}
            selectedDomain={selectedDomain}
          />
        )}

        {activeTab === 'setupGuide' && (
          <DnsGuide
            language={language}
            selectedDomain={selectedDomain}
          />
        )}

        {activeTab === 'aiAdvisor' && (
          <AiAdvisor
            language={language}
            selectedDomain={selectedDomain}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">Vashisht Joshi</span>
            <span>•</span>
            <span>Business Domain & Free Email Suite</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('freeEmail')}
              className="text-emerald-700 font-bold hover:underline transition-colors cursor-pointer"
            >
              100% Free Email (₹0)
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('setupGuide')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              DNS Records
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('signature')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              Gmail Signature
            </button>
            <span>•</span>
            <button
              onClick={() => setActiveTab('aiAdvisor')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              AI Consultant
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
