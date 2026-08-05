import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a single DOM window for DOMPurify
const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Safe HTML sanitization config
const DEFAULT_SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    'p', 'br', 'strong', 'em', 'u', 's',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'li', 'blockquote', 'pre',
    'code', 'span', 'div', 'a', 'img',
    'table', 'thead', 'tbody', 'tr', 'td', 'th',
  ],
  ALLOWED_ATTR: [
    'class', 'id', 'href', 'src', 'alt', 'title',
    'style', 'target', 'rel', 'width', 'height',
  ],
  FORBID_TAGS: [
    'script', 'iframe', 'object', 'embed', 'form',
    'input', 'button', 'textarea', 'select',
    'meta', 'link', 'style', 'applet',
  ],
  FORBID_ATTR: [
    'onerror', 'onload', 'onclick', 'onmouseover',
    'onfocus', 'onblur', 'onchange', 'onsubmit',
  ],
};

export function sanitizeHtml(html: string): string {
  return purify.sanitize(html, DEFAULT_SANITIZE_CONFIG);
}

export function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export function encodeUriComponent(str: string): string {
  return encodeURIComponent(str);
}

// Safe JSON stringify with XSS protection
export function safeJsonStringify(data: unknown): string {
  const json = JSON.stringify(data);
  return json.replace(/<\/script>/gi, '\\u003c/script>');
}
