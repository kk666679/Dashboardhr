// Minimal test-runner globals so `tsc --noEmit` can typecheck test files.
// Works for Jest/Mocha-style globals used under `__tests__`.

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void | Promise<void>) => void;
declare const expect: (value: unknown) => {
  toBe: (expected: unknown) => void;
  toBeDefined: () => void;
  toBeTruthy: () => void;
  toEqual: (expected: unknown) => void;
  toBeInstanceOf: (ctor: new (...args: any[]) => any) => void;
  toContain: (item: unknown) => void;
  toHaveLength: (len: number) => void;
  toBeGreaterThan: (n: number) => void;
  toBeLessThan: (n: number) => void;
  toBeGreaterThanOrEqual: (n: number) => void;
  toBeLessThanOrEqual: (n: number) => void;
};

