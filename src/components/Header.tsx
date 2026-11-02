import React from 'react';
import { Mail, ShieldCheck, Globe, Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  selectedDomain: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  selectedDomain,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="border-b border-slate-200 bg-white relative z-20 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  Vashisht Joshi
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-blue-600" />
                  Google Workspace Ready
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Professional Domain & Business Gmail Studio
              </p>
            </div>
          </div>

          {/* Right Controls: Active Domain Pill & Language Selector */}
          <div className="flex items-center gap-3">
            {selectedDomain && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                <Globe className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-400">Selected:</span>
                <span className="font-mono font-semibold text-blue-600">{selectedDomain}</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => onLanguageChange('hinglish')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'hinglish'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Hinglish (Hindi in Latin script)"
              >
                Hinglish
              </button>
              <button
                onClick={() => onLanguageChange('hindi')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'hindi'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="हिंदी (Devanagari script)"
              >
                हिंदी
              </button>
              <button
                onClick={() => onLanguageChange('english')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  language === 'english'
                    ? 'bg-white text-blue-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                English
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
