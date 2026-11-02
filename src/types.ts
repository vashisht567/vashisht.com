export type Language = 'hinglish' | 'hindi' | 'english';

export interface DomainItem {
  domain: string;
  extension: string;
  category: string;
  appealScore: number;
  memorability: string;
  pronounceability: string;
  priceEstimate: string;
  recommendedFor: string;
  suggestedEmails: string[];
  badge?: string;
  tagline?: string;
}

export interface DnsCheckResult {
  domain: string;
  status: 'available' | 'registered' | 'unknown';
  details: string;
  registrarLinks?: {
    googleWorkspace: string;
    namecheap: string;
    godaddy: string;
    hostinger: string;
  };
}

export interface SignatureData {
  fullName: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  location: string;
  themeColor: string;
  style: 'classic' | 'modern' | 'minimal';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
