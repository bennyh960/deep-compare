import type { MissingValuesResult } from '../types';

/**
 * Checks if a value is a Date object.
 * @param value - The value to check
 * @returns True if the value is a Date instance
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

/**
 * Checks if a Date object is valid (not Invalid Date).
 * @param date - The Date to validate
 * @returns True if the date is valid
 */
export function isValidDate(date: Date): boolean {
  return !isNaN(date.getTime());
}

/**
 * Checks if a value is a RegExp object.
 * @param value - The value to check
 * @returns True if the value is a RegExp instance
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp;
}

/**
 * Checks if a value is a plain object (not null, array, Date, RegExp, etc.).
 * @param value - The value to check
 * @returns True if the value is a plain object
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  if (isDate(value) || isRegExp(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Checks if a value is null.
 * @param value - The value to check
 * @returns True if the value is null
 */
export function isNull(value: unknown): value is null {
  return value === null;
}

/**
 * Checks if a value is undefined.
 * @param value - The value to check
 * @returns True if the value is undefined
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined;
}

/**
 * Checks if a value is NaN.
 * @param value - The value to check
 * @returns True if the value is NaN
 */
export function isNaNValue(value: unknown): boolean {
  return typeof value === 'number' && isNaN(value);
}

/**
 * Detects missing values between two arrays.
 * @param arrA - First array of strings
 * @param arrB - Second array of strings
 * @returns Object containing arrays of missing values
 */
export function detectMissingValues(arrA: string[], arrB: string[]): MissingValuesResult {
  const setA = new Set(arrA);
  const setB = new Set(arrB);

  const missingInA = arrB.filter(item => !setA.has(item));
  const missingInB = arrA.filter(item => !setB.has(item));

  return { missingInA, missingInB };
}

/**
 * Formats missing values into a human-readable string.
 * @param arrA - First array of keys
 * @param arrB - Second array of keys
 * @param nameA - Display name for the first object
 * @param nameB - Display name for the second object
 * @returns Formatted string describing missing values
 */
export function formatMissingValues(arrA: string[], arrB: string[], nameA: string, nameB: string): string {
  const { missingInA, missingInB } = detectMissingValues(arrA, arrB);
  const parts: string[] = [];

  if (missingInA.length > 0) {
    parts.push(`[${missingInA.join(', ')}] missing in ${nameA}`);
  }

  if (missingInB.length > 0) {
    parts.push(`[${missingInB.join(', ')}] missing in ${nameB}`);
  }

  return parts.join('; ');
}

/**
 * Builds a path string for nested properties.
 * @param basePath - The current path
 * @param key - The key to append
 * @returns The combined path string
 */
export function buildPath(basePath: string, key: string | number): string {
  if (typeof key === 'number') {
    return `${basePath}[${key}]`;
  }

  return basePath ? `${basePath}.${key}` : key;
}

/**
 * Gets the type name of a value for error messages.
 * @param value - The value to get the type of
 * @returns A string representing the type
 */
export function getTypeName(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (isDate(value)) return 'Date';
  if (isRegExp(value)) return 'RegExp';
  if (isNaNValue(value)) return 'NaN';
  return typeof value;
}
