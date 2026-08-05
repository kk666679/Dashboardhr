import { URL } from 'url';

const ALLOWED_DOMAINS = [
  'aifwms.xyz',
  'api.openai.com',
  'api.anthropic.com',
  'api.ollama.ai',
  'api.deepseek.com',
];

// Loopback is allowed only in non-production (for local Ollama etc.)
const ALLOWED_LOOPBACK = process.env.NODE_ENV !== 'production';

const PRIVATE_IP_PREFIXES = [
  '10.',
  '172.16.', '172.17.', '172.18.', '172.19.', '172.20.',
  '172.21.', '172.22.', '172.23.', '172.24.', '172.25.',
  '172.26.', '172.27.', '172.28.', '172.29.', '172.30.',
  '172.31.',
  '192.168.',
  '169.254.',  // link-local / AWS metadata
];

const LOOPBACK = ['localhost', '127.0.0.1', '::1'];

export function isSafeUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    
    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }
    
    const hostname = url.hostname.toLowerCase();

    // Loopback / localhost — only allowed in non-production
    if (LOOPBACK.includes(hostname)) {
      return ALLOWED_LOOPBACK;
    }

    // Block all private IP ranges (SSRF protection for cloud metadata etc.)
    if (hostname === '0.0.0.0') return false;
    if (PRIVATE_IP_PREFIXES.some(prefix => hostname.startsWith(prefix))) return false;

    // Check hostname against allowlist
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    return isAllowed;
  } catch {
    return false;
  }
}

export async function safeFetch(url: string, options?: RequestInit) {
  if (!isSafeUrl(url)) {
    throw new Error(`Blocked URL: ${url}`);
  }
  return fetch(url, options);
}
