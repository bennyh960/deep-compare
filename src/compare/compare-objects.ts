import type { ComparableValue, ComparisonConfig, ComparisonError } from '../types';
import { ComparisonErrorType, DEFAULT_CONFIG } from '../types';
import { isDate, isValidDate, isRegExp, isPlainObject, isNull, isUndefined, isNaNValue, buildPath } from '../utils';

/**
 * Creates a comparison error object with the given details.
 */
function createError(
  path: string,
  type: ComparisonErrorType,
  valueA: unknown,
  valueB: unknown,
  nameA: string,
  nameB: string,
  message: string
): ComparisonError {
  return {
    path: path || '(root)',
    type,
    [nameA]: valueA,
    [nameB]: valueB,
    message,
  };
}

/**
 * Compares two Date objects for equality.
 */
function compareDates(dateA: Date, dateB: Date, path: string, nameA: string, nameB: string): ComparisonError[] {
  const errors: ComparisonError[] = [];

  const isValidA = isValidDate(dateA);
  const isValidB = isValidDate(dateB);

  // Check for invalid dates
  if (!isValidA || !isValidB) {
    if (isValidA !== isValidB) {
      const faultySide = !isValidA ? nameA : nameB;
      errors.push(
        createError(
          path,
          ComparisonErrorType.INVALID_DATE,
          isValidA ? dateA.toISOString() : 'Invalid Date',
          isValidB ? dateB.toISOString() : 'Invalid Date',
          nameA,
          nameB,
          `Comparison failed: ${faultySide} contains an invalid Date object`
        )
      );
    }
    return errors;
  }

  // Compare timestamps
  if (dateA.getTime() !== dateB.getTime()) {
    const message = `Dates do not match`;
    errors.push(createError(path, ComparisonErrorType.DATE_MISMATCH, dateA.toISOString(), dateB.toISOString(), nameA, nameB, message));
  }

  return errors;
}

/**
 * Compares two RegExp objects for equality.
 */
function compareRegExp(regexA: RegExp, regexB: RegExp, path: string, nameA: string, nameB: string): ComparisonError[] {
  const errors: ComparisonError[] = [];

  const strA = regexA.toString();
  const strB = regexB.toString();

  if (strA !== strB) {
    let message = 'Regular expressions do not match';

    // Provide more detail if the patterns are the same but flags differ
    if (regexA.source === regexB.source && regexA.flags !== regexB.flags) {
      message = `Regex patterns are identical, but flags differ: /${regexA.flags}/ vs /${regexB.flags}/`;
    } else if (regexA.source !== regexB.source) {
      message = `Regex patterns are different: ${strA} vs ${strB}`;
    }

    errors.push(createError(path, ComparisonErrorType.REGEX_MISMATCH, strA, strB, nameA, nameB, message));
  }

  return errors;
}

/**
 * Compares two arrays for equality.
 */
function compareArrays(arrA: unknown[], arrB: unknown[], path: string, config: ComparisonConfig): ComparisonError[] {
  const errors: ComparisonError[] = [];
  const { nameA, nameB } = config;

  // Report length mismatch
  if (arrA.length !== arrB.length) {
    const message = `Array length mismatch: ${nameA}.${path} has ${arrA.length} elements, but ${nameB}.${path} has ${arrB.length} elements`;
    errors.push(createError(path, ComparisonErrorType.ARRAY_LENGTH_MISMATCH, arrA.length, arrB.length, nameA, nameB, message));
  }

  // Compare elements up to the minimum length
  const minLength = Math.min(arrA.length, arrB.length);
  for (let i = 0; i < minLength; i++) {
    const elementPath = buildPath(path, i);
    errors.push(...compareValues(arrA[i], arrB[i], elementPath, config));
  }

  return errors;
}

/**
 * Compares two plain objects for equality.
 */
function comparePlainObjects(
  objA: Record<string, unknown>,
  objB: Record<string, unknown>,
  path: string,
  config: ComparisonConfig
): ComparisonError[] {
  const errors: ComparisonError[] = [];
  const { nameA, nameB } = config;

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  // Report key length mismatch with details
  if (keysA.length !== keysB.length) {
    errors.push(createError(path, ComparisonErrorType.KEY_LENGTH_MISMATCH, keysA.length, keysB.length, nameA, nameB, `Key count mismatch`));
  }

  // Get all unique keys from both objects
  const allKeys = new Set([...keysA, ...keysB]);

  for (const key of allKeys) {
    const keyPath = buildPath(path, key);
    const hasKeyA = key in objA;
    const hasKeyB = key in objB;

    // Check for missing keys
    if (!hasKeyA) {
      const message = `Property "${key}" is missing in ${nameA}.${keyPath} but exists in ${nameB}.${keyPath}`;
      errors.push(createError(keyPath, ComparisonErrorType.MISSING_KEY, undefined, objB[key], nameA, nameB, message));
      continue;
    }

    if (!hasKeyB) {
      const message = `Property "${key}" is missing in ${nameB}.${keyPath} but exists in ${nameA}.${keyPath}`;
      errors.push(createError(keyPath, ComparisonErrorType.MISSING_KEY, objA[key], undefined, nameA, nameB, message));
      continue;
    }

    // Recursively compare values
    errors.push(...compareValues(objA[key], objB[key], keyPath, config));
  }

  return errors;
}

/**
 * Compares two primitive values for equality.
 */
function comparePrimitives(valueA: unknown, valueB: unknown, path: string, nameA: string, nameB: string): ComparisonError[] {
  const errors: ComparisonError[] = [];

  // 1. Handle NaN specially (NaN !== NaN in JavaScript)
  const isNaNA = isNaNValue(valueA);
  const isNaNB = isNaNValue(valueB);

  // Handle NaN specially (NaN !== NaN in JavaScript)
  if (isNaNA && isNaNB) {
    return errors; // Both NaN, considered equal
  }

  if (isNaNA || isNaNB) {
    const nanSide = isNaNA ? nameA : nameB;
    const message = `Value mismatch: ${nanSide}.${path} is NaN (Not-a-Number) while the other side is a valid number or type`;
    errors.push(createError(path, ComparisonErrorType.NAN_MISMATCH, valueA, valueB, nameA, nameB, message));
    return errors;
  }

  if (valueA !== valueB) {
    errors.push(createError(path, ComparisonErrorType.VALUE_MISMATCH, valueA, valueB, nameA, nameB, 'Value Mismatch'));
  }

  return errors;
}

/**
 * Main comparison function that handles all value types.
 */
function compareValues(valueA: ComparableValue, valueB: ComparableValue, path: string, config: ComparisonConfig): ComparisonError[] {
  const { nameA, nameB } = config;

  // Handle undefined
  if (isUndefined(valueA) || isUndefined(valueB)) {
    if (isUndefined(valueA) !== isUndefined(valueB)) {
      const missingSide = isUndefined(valueA) ? nameA : nameB;
      const presentSide = isUndefined(valueA) ? nameB : nameA;
      const message = `Value is undefined in ${missingSide} but defined in ${presentSide}`;
      return [createError(path, ComparisonErrorType.UNDEFINED_MISMATCH, valueA, valueB, nameA, nameB, message)];
    }
    return [];
  }

  // Handle null
  if (isNull(valueA) || isNull(valueB)) {
    if (isNull(valueA) !== isNull(valueB)) {
      const message = isNull(valueA) ? `${nameA} is null, but ${nameB} has a value` : `${nameA} has a value, but ${nameB} is null`;
      return [createError(path, ComparisonErrorType.NULL_MISMATCH, valueA, valueB, nameA, nameB, message)];
    }
    return [];
  }

  // Handle type mismatch (after null/undefined checks)
  if (typeof valueA !== typeof valueB) {
    return [createError(path, ComparisonErrorType.TYPE_MISMATCH, valueA, valueB, nameA, nameB, 'Type mismatch')];
  }

  // Handle Date objects
  if (isDate(valueA) && isDate(valueB)) {
    return compareDates(valueA, valueB, path, nameA, nameB);
  }

  // Handle Date vs non-Date object mismatch
  if (isDate(valueA) || isDate(valueB)) {
    return [createError(path, ComparisonErrorType.TYPE_MISMATCH, valueA, valueB, nameA, nameB, 'Type mismatch')];
  }

  // Handle RegExp objects
  if (isRegExp(valueA) && isRegExp(valueB)) {
    return compareRegExp(valueA, valueB, path, nameA, nameB);
  }

  // Handle RegExp vs non-RegExp object mismatch
  if (isRegExp(valueA) || isRegExp(valueB)) {
    return [createError(path, ComparisonErrorType.TYPE_MISMATCH, valueA, valueB, nameA, nameB, 'Type mismatch')];
  }

  // Handle arrays
  if (Array.isArray(valueA) && Array.isArray(valueB)) {
    return compareArrays(valueA, valueB, path, config);
  }

  // Handle array vs non-array mismatch
  if (Array.isArray(valueA) || Array.isArray(valueB)) {
    return [createError(path, ComparisonErrorType.TYPE_MISMATCH, valueA, valueB, nameA, nameB, 'Type mismatch')];
  }

  // Handle plain objects
  if (isPlainObject(valueA) && isPlainObject(valueB)) {
    return comparePlainObjects(valueA, valueB, path, config);
  }

  // Handle primitives (string, number, boolean, symbol, bigint)
  return comparePrimitives(valueA, valueB, path, nameA, nameB);
}

/**
 * Deeply compares two objects and returns an array of differences.
 *
 * @param objA - The first object to compare
 * @param objB - The second object to compare
 * @param path - The current path (used internally for recursion)
 * @param config - Configuration options for comparison
 * @returns An array of ComparisonError objects describing all differences
 *
 * @example
 * ```typescript
 * const errors = compareObjects(
 *   { name: 'John', age: 30 },
 *   { name: 'Jane', age: 30 },
 *   '',
 *   { nameA: 'expected', nameB: 'actual' }
 * );
 * // Returns: [{ path: 'name', type: 'Value Mismatch', expected: 'John', actual: 'Jane' }]
 * ```
 */
export function compareObjects(
  objA: ComparableValue,
  objB: ComparableValue,
  path = '',
  config: ComparisonConfig = DEFAULT_CONFIG
): ComparisonError[] {
  return compareValues(objA, objB, path, config);
}
