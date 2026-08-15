import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @desc returns a splitted string cleaning empty values
**/
export function cleanSplit({ value, criteria }: { value: string, criteria: string }) {
  if (typeof value === 'string') {
    return value.split(criteria).filter(it => it)
  }

  return value
}

/**
 * @desc returns the base path of the current path
**/
export function getBasePath(pathname: string) {
  return cleanSplit({
    value: pathname,
    criteria: '/'
  }).slice(0, -1).join('/')
}

/**
 * @desc returns a unique array by a key
**/
export function getUniqueByKey<T extends Record<string, unknown>>(array: T[], key: string) {
  return array.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

/**
 * @desc clean symbols from a string
 */
export const cleanSymbols = (value: string) => {
  return value.replace(/[^\w\s]/g, '')
}

/**
 * @desc returns a property of an array of objects
 */
export const getPropertyOfArray = (value: unknown, property: string) => {
  if (Array.isArray(value)) {
    return value.map((item) => item[property])
  }

  return value
}

/**
 * @desc returns a v4 compliant UUID using cryptographically secure values when available, falling back to a math-random based generator for non-secure mobile viewports.
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const buffer = new Uint8Array(16);
    crypto.getRandomValues(buffer);
    buffer[6] = (buffer[6] & 0x0f) | 0x40; // Version 4
    buffer[8] = (buffer[8] & 0x3f) | 0x80; // Variant 10xx
    const hex: string[] = [];
    for (let i = 0; i < 16; i++) {
      hex.push(buffer[i].toString(16).padStart(2, '0'));
    }
    return [
      hex.slice(0, 4).join(''),
      hex.slice(4, 6).join(''),
      hex.slice(6, 8).join(''),
      hex.slice(8, 10).join(''),
      hex.slice(10, 16).join('')
    ].join('-');
  }
  // Math.random fallback (highly compatible for unsecure hostnames/HTTP contexts on mobile)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    // eslint-disable-next-line sonarjs/pseudo-random
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}


