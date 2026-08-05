import { resolve, sep, normalize } from 'path';

export function validatePath(baseDir: string, userPath: string): string {
  // Normalize paths
  const normalizedBase = normalize(baseDir);
  const normalizedUser = normalize(userPath);
  
  // Resolve relative to base
  const resolved = resolve(normalizedBase, normalizedUser);
  
  // Ensure resolved path stays within baseDir
  if (!resolved.startsWith(normalizedBase + sep) && resolved !== normalizedBase) {
    throw new Error('Path traversal detected');
  }
  
  // Block dangerous patterns
  const dangerousPatterns = ['..', '\0', '//', '\\\\'];
  for (const pattern of dangerousPatterns) {
    if (userPath.includes(pattern)) {
      throw new Error('Invalid path: contains dangerous pattern');
    }
  }
  
  return resolved;
}

export function isValidFilename(filename: string): boolean {
  const blockedChars = ['/', '\\', '\0', '..', '~', ':'];
  return !blockedChars.some(char => filename.includes(char));
}

export const ALLOWED_FILE_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx',
  '.txt', '.csv', '.json', '.xml',
  '.drawio', '.svg'
];

export function isValidFileExtension(filename: string): boolean {
  const ext = filename.toLowerCase();
  return ALLOWED_FILE_EXTENSIONS.some(allowed => ext.endsWith(allowed));
}
