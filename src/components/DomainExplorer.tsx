import React, { useState } from 'react';
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Search,
  Sparkles,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  RefreshCw,
  Mail,
  HelpCircle,
} from 'lucide-react';
import { DomainItem, DnsCheckResult, Language } from '../types';
import { TRANSLATIONS, DEFAULT_DOMAINS_DATA } from '../data/translations';

interface DomainExplorerProps {
  language: Language;
  selectedDomain: string;
  onSelectDomain: (domain: string) => void;
  onNavigateToPreview: () => void;
}

export const DomainExplorer: React.FC<DomainExplorerProps> = ({
  language,
  selectedDomain,
  onSelectDomain,
  onNavigateToPreview,
}) => {
  const t = TRANSLATIONS[language];
  const [domains, setDomains] = useState<DomainItem[]>(DEFAULT_DOMAINS_DATA);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [customIndustry, setCustomIndustry] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [manualDomain, setManualDomain] = useState<string>('');
  const [dnsResults, setDnsResults] = useState<Record<string, DnsCheckResult>>({});
  const [checkingDnsFor, setCheckingDnsFor] = useState<string | null>(null);

  // Filter domains by category
  const filteredDomains = domains.filter((d) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'personal') {
      return d.category.toLowerCase().includes('personal') || d.domain.includes('vashishtjoshi');
    }
    if (activeCategory === 'consulting') {
      return d.category.toLowerCase().includes('consult') || d.category.toLowerCase().includes('advisory');
    }
    if (activeCategory === 'tech') {
      return d.category.toLowerCase().includes('tech') || d.extension === '.io';
    }
    if (activeCategory === 'corporate') {
      return d.category.toLowerCase().includes('enterprise') || d.category.toLowerCase().includes('group');
    }
    return true;
  });

  // Handle checking DNS for a domain
  const handleCheckDns = async (domainName: string) => {
    setCheckingDnsFor(domainName);
    try {
      const res = await fetch('/api/check-domain-dns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainName }),
      });
      const data = await res.json();
      setDnsResults((prev) => ({
        ...prev,
        [domainName]: data,
      }));
    } catch (err) {
      console.error('DNS check error:', err);
      setDnsResults((prev) => ({
        ...prev,
        [domainName]: {
          domain: domainName,
          status: 'unknown',
          details: 'Verification failed. Try again.',
        },
      }));
    } finally {
      setCheckingDnsFor(null);
    }
  };

  // Generate domains with AI
  const handleGenerateAi = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!customIndustry.trim()) return;

    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: customIndustry,
          market: 'India & Global',
        }),
      });
      const data = await res.json();
      if (data.domains && Array.isArray(data.domains) && data.domains.length > 0) {
        setDomains(data.domains);
        setActiveCategory('all');
      }
    } catch (err) {
      console.error('Failed to generate domains:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Add custom manual domain
  const handleAddManualDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = manualDomain.trim().toLowerCase().replace(/^https?:\/\//, '');
    if (!clean) return;

    const extMatch = clean.match(/\.[a-z]{2,}$/);
    const ext = extMatch ? extMatch[0] : '.com';
    const full = extMatch ? clean : `${clean}.com`;

    const newDomain: DomainItem = {
      domain: full,
      extension: ext,
      category: 'Custom Search',
      appealScore: 92,
      memorability: 'Custom Name',
      pronounceability: 'Your Custom Choice',
      priceEstimate: '₹799 - ₹1,499 / yr',
      recommendedFor: 'Custom domain searched by Vashisht Joshi.',
      suggestedEmails: [`vashisht@${full}`, `contact@${full}`, `info@${full}`],
      badge: 'Custom Choice',
      tagline: 'Your Personalized Name',
    };

    setDomains([newDomain, ...domains]);
    onSelectDomain(full);
    handleCheckDns(full);
    setManualDomain('');
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner for Vashisht Joshi */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            Vashisht Joshi Special Business Edition
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
            {t.heroHeading}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
            {t.heroSub}
          </p>

          {/* Quick Active Selection Highlight */}
          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-700/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{t.selectedDomainLabel}</span>
              <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-lg text-sm sm:text-base">
                {selectedDomain}
              </span>
            </div>
            <button
              onClick={onNavigateToPreview}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              {t.tabs.preview}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* AI Industry Tailor & Manual Search Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* AI Industry Generator */}
        <div className="lg:col-span-7 bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'hindi'
                ? 'अपने व्यापार क्षेत्र के अनुसार AI से डोमेन खोजें'
                : 'Custom Niche / Business AI Generator'}
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-3">
            {language === 'hindi'
              ? 'अगर आपका कोई विशेष बिजनेस है (जैसे एक्सपोर्ट, रियल एस्टेट, आईटी, अकाउंटिंग), तो यहाँ लिखें:'
              : 'Specify your exact business niche or keywords to get tailored domain concepts for Vashisht Joshi:'}
          </p>
          <form onSubmit={handleGenerateAi} className="flex gap-2">
            <input
              type="text"
              value={customIndustry}
              onChange={(e) => setCustomIndustry(e.target.value)}
              placeholder={t.nichePlaceholder}
              className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
            <button
              type="submit"
              disabled={isGenerating || !customIndustry.trim()}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  {t.generateAiDomains}
                </>
              )}
            </button>
          </form>

          {/* Quick Niche Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-slate-100">
            <span className="text-[11px] text-slate-400 font-medium self-center mr-1">Quick:</span>
            {['IT & Software', 'Consulting & Advisory', 'Real Estate', 'Import & Export', 'Financial Services', 'Freelance Agency'].map((niche) => (
              <button
                key={niche}
                onClick={() => {
                  setCustomIndustry(niche);
                }}
                className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Manual Domain Verification */}
        <div className="lg:col-span-5 bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Search className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                {language === 'hindi' ? 'कोई भी डोमेन सीधे जांचें' : 'Check Any Custom Domain Name'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {language === 'hindi'
                ? 'यदि आपके मन में कोई दूसरा डोमेन नाम है, तो यहाँ टाइप करके टेस्ट करें:'
                : 'Have another specific domain in mind? Type it here to test its DNS status:'}
            </p>
          </div>
          <form onSubmit={handleAddManualDomain} className="flex gap-2">
            <input
              type="text"
              value={manualDomain}
              onChange={(e) => setManualDomain(e.target.value)}
              placeholder="e.g. vashishtconsulting.in"
              className="flex-1 px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50 font-mono"
            />
            <button
              type="submit"
              disabled={!manualDomain.trim()}
              className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Test
            </button>
          </form>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          {t.filterAll} ({domains.length})
        </button>
        <button
          onClick={() => setActiveCategory('personal')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'personal'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          {t.filterPersonal}
        </button>
        <button
          onClick={() => setActiveCategory('consulting')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'consulting'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          {t.filterConsulting}
        </button>
        <button
          onClick={() => setActiveCategory('tech')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'tech'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          {t.filterTech}
        </button>
        <button
          onClick={() => setActiveCategory('corporate')}
          className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
            activeCategory === 'corporate'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          {t.filterCorporate}
        </button>
      </div>

      {/* Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredDomains.map((item) => {
          const isSelected = selectedDomain === item.domain;
          const dnsInfo = dnsResults[item.domain];
          const isChecking = checkingDnsFor === item.domain;

          return (
            <div
              key={item.domain}
              className={`rounded-xl border transition-all duration-200 bg-white p-5 flex flex-col justify-between ${
                isSelected
                  ? 'border-blue-600 ring-2 ring-blue-600/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Header: Domain Name & Badge */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-bold text-slate-900 font-mono tracking-tight">
                        {item.domain}
                      </h4>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {item.extension}
                      </span>
                    </div>
                    {item.tagline && (
                      <p className="text-xs font-medium text-slate-500 mt-0.5">
                        {item.tagline} • <span className="text-slate-600">{item.category}</span>
                      </p>
                    )}
                  </div>

                  {item.badge && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Score & Pricing Row */}
                <div className="flex items-center gap-4 my-3 text-xs text-slate-600 border-y border-slate-100 py-2">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>Appeal:</span>
                    <strong className="text-slate-900 font-semibold">{item.appealScore}/100</strong>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Price:</span>
                    <strong className="text-slate-900 font-semibold">{item.priceEstimate}</strong>
                  </div>
                </div>

                {/* Why it works */}
                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.recommendedFor}
                </p>

                {/* Sample Email Preview Chips */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Sample Google Workspace Email:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {item.suggestedEmails.map((email) => (
                      <span
                        key={email}
                        className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-100"
                      >
                        {email}
                      </span>
                    ))}
                  </div>
                </div>

                {/* DNS Status Feedback Box */}
                {dnsInfo && (
                  <div
                    className={`p-3 rounded-lg text-xs mb-3 flex items-start gap-2 ${
                      dnsInfo.status === 'available'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : dnsInfo.status === 'registered'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}
                  >
                    {dnsInfo.status === 'available' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-semibold">
                        {dnsInfo.status === 'available'
                          ? t.statusAvailable
                          : dnsInfo.status === 'registered'
                          ? t.statusRegistered
                          : t.statusUnknown}
                      </div>
                      <div className="text-[11px] opacity-90 mt-0.5">{dnsInfo.details}</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  {/* Select for Gmail */}
                  <button
                    onClick={() => {
                      onSelectDomain(item.domain);
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Selected for Gmail
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5 text-blue-600" />
                        {t.useThisDomain}
                      </>
                    )}
                  </button>

                  {/* Check DNS */}
                  <button
                    onClick={() => handleCheckDns(item.domain)}
                    disabled={isChecking}
                    className="py-2 px-3 rounded-lg text-xs font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-60"
                    title="Live DNS Availability Check"
                  >
                    {isChecking ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    ) : (
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                    )}
                    <span>{isChecking ? 'Checking...' : 'Check DNS'}</span>
                  </button>
                </div>

                {/* Direct Registrar Links */}
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>{t.buyDirectly}</span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`https://workspace.google.com/intl/en_in/business/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center gap-0.5 font-medium"
                    >
                      Google Workspace <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <a
                      href={`https://in.godaddy.com/domainsearch/find?domainToCheck=${encodeURIComponent(
                        item.domain
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5"
                    >
                      GoDaddy <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <span>•</span>
                    <a
                      href={`https://www.hostinger.in/domain-name-search?domain=${encodeURIComponent(
                        item.domain
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 hover:text-slate-900 hover:underline flex items-center gap-0.5"
                    >
                      Hostinger <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
