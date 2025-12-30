/**
 * Deep Compare - A comprehensive deep comparison utility for JavaScript/TypeScript
 *
 * Supports comparison of:
 * - Primitive values (string, number, boolean, null, undefined)
 * - Objects (plain objects, nested structures)
 * - Arrays (with element-by-element comparison)
 * - Dates (with proper timestamp comparison)
 * - Regular Expressions
 * - NaN values
 *
 * @module deep-compare
 */

// Re-export main comparison function
export { compareObjects } from './compare';

// Re-export types for consumers
export type { ComparisonError, ComparisonConfig, ComparableValue, MissingValuesResult } from './types';

// Re-export enums
export { ComparisonErrorType, DEFAULT_CONFIG } from './types';

// Re-export utilities for advanced usage
export {
  isDate,
  isValidDate,
  isRegExp,
  isPlainObject,
  isNull,
  isUndefined,
  isNaNValue,
  detectMissingValues,
  formatMissingValues,
  buildPath,
  getTypeName,
} from './utils';
