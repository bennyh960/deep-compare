/**
 * Configuration options for the comparison function.
 */
export interface ComparisonConfig {
  /** Display name for the first object in error messages */
  nameA: string;
  /** Display name for the second object in error messages */
  nameB: string;
}

/**
 * Default configuration for comparison.
 */
export const DEFAULT_CONFIG: ComparisonConfig = {
  nameA: 'expected',
  nameB: 'actual',
};

/**
 * Enumeration of all possible comparison error types.
 */
export enum ComparisonErrorType {
  TYPE_MISMATCH = 'Type Mismatch',
  NULL_MISMATCH = 'Null Mismatch',
  UNDEFINED_MISMATCH = 'Undefined Mismatch',
  DATE_MISMATCH = 'Date Mismatch',
  INVALID_DATE = 'Invalid Date',
  ARRAY_LENGTH_MISMATCH = 'Array Length Mismatch',
  KEY_LENGTH_MISMATCH = 'Key Length Mismatch',
  MISSING_KEY = 'Missing Key',
  VALUE_MISMATCH = 'Value Mismatch',
  NAN_MISMATCH = 'NaN Mismatch',
  REGEX_MISMATCH = 'RegExp Mismatch',
}

/**
 * Represents a single comparison error with details about the mismatch.
 */
export interface ComparisonError {
  /** The path to the property where the mismatch occurred */
  path: string;
  /** The type of error that occurred */
  type: ComparisonErrorType | string;
  /** Dynamic properties for the compared values */
  [key: string]: unknown;
}

/**
 * Result of detecting missing values between two arrays.
 */
export interface MissingValuesResult {
  /** Values present in B but missing in A */
  missingInA: string[];
  /** Values present in A but missing in B */
  missingInB: string[];
}

/**
 * Type alias for any comparable value.
 */
export type ComparableValue = unknown;
