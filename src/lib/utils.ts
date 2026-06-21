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

