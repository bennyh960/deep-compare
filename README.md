# deep-obj-compare

A lightweight TypeScript utility for deep comparison of JavaScript objects with detailed error
reporting and path tracking.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install deep-obj-compare
```

## Features

- 🔍 Deep comparison of nested objects and arrays
- 📍 Precise path tracking for mismatches
- 📅 Date and RegExp support
- 🔢 Proper NaN handling
- 💬 Customizable object naming in error reports
- 📦 Zero dependencies
- 🎯 Full TypeScript support

## Quick Start

```typescript
import { compareObjects } from 'deep-obj-compare';

const expected = { name: 'Alice', age: 30, address: { city: 'NYC' } };
const actual = { name: 'Alice', age: 30, address: { city: 'LA' } };

const errors = compareObjects(expected, actual);
// Returns:
// [
//   { path: 'address.city', type: 'Value Mismatch', expected: 'NYC', actual: 'LA' }
// ]
```

## API

### `compareObjects(objA, objB, config?)`

Compares two objects and returns an array of differences.

| Parameter | Type               | Description              |
| --------- | ------------------ | ------------------------ |
| `objA`    | `any`              | First object to compare  |
| `objB`    | `any`              | Second object to compare |
| `config`  | `ComparisonConfig` | Optional configuration   |

#### Config Options

```typescript
interface ComparisonConfig {
  nameA?: string; // Display name for first object (default: 'expected')
  nameB?: string; // Display name for second object (default: 'actual')
}
```

## Examples

### Array Comparison

```typescript
const expected = { items: [1, 2, 3] };
const actual = { items: [1, 2, 4] };

compareObjects(expected, actual);
// [{ path: 'items[2]', type: 'Value Mismatch', expected: 3, actual: 4 }]
```

### Custom Naming

```typescript
const source = { status: 'active' };
const target = { status: 'pending' };

compareObjects(source, target, { nameA: 'source', nameB: 'target' });
// [{ path: 'status', type: 'Value Mismatch', source: 'active', target: 'pending' }]
```

### Missing Keys Detection

```typescript
const expected = { x: 1, y: 2 };
const actual = { x: 1, z: 3 };

compareObjects(expected, actual);
// [
//   { path: '(root)', type: 'Key Length Mismatch ([z] missing in expected, [y] missing in actual)', ... },
//   { path: 'y', type: 'Missing Key in actual', expected: 2, actual: undefined },
//   { path: 'z', type: 'Missing Key in expected', expected: undefined, actual: 3 }
// ]
```

### Date Comparison

```typescript
const expected = { created: new Date('2024-01-01') };
const actual = { created: new Date('2024-06-01') };

compareObjects(expected, actual);
// [{ path: 'created', type: 'Date Mismatch', expected: '2024-01-01T00:00:00.000Z', actual: '2024-06-01T00:00:00.000Z' }]
```

## Error Types

| Type                    | Description                                |
| ----------------------- | ------------------------------------------ |
| `Type Mismatch`         | Different types (e.g., string vs number)   |
| `Value Mismatch`        | Same type but different values             |
| `Null Mismatch`         | One is null, the other is not              |
| `Array Length Mismatch` | Arrays have different lengths              |
| `Key Length Mismatch`   | Objects have different number of keys      |
| `Missing Key`           | Key exists in one object but not the other |
| `Date Mismatch`         | Date values differ                         |
| `RegExp Mismatch`       | Regular expressions differ                 |
| `NaN Mismatch`          | One is NaN, the other is not               |

## License

MIT © [bennyh960](https://github.com/bennyh960)
