import { compareObjects } from '.';

const dateRef = new Date('2025-01-01T12:00:00Z');

const objectA = {
  profile: {
    name: 'Developer',
    status: null,
    settings: {
      flags: /debug/g,
      theme: 'dark',
      preferences: undefined,
    },
  },
  metrics: [10, NaN, { value: 100, timestamp: dateRef }, ['level1', ['level2']]],
  metadata: {
    lastSeen: new Date('2024-12-31'),
    version: 1.0,
    tags: ['alpha', 'beta'],
  },
  extra: 'should be missing',
};

const objectB = {
  profile: {
    name: 'Developer',
    status: undefined, // 1. NULL vs UNDEFINED mismatch
    settings: {
      flags: /debug/i, // 2. REGEX flag mismatch (/g/ vs /i/)
      theme: 'light', // 3. PRIMITIVE value mismatch
      // preferences missing      // 4. MISSING_KEY vs UNDEFINED
    },
  },
  metrics: [
    '10', // 5. TYPE mismatch (number vs string)
    NaN, // (Should be EQUAL)
    { value: 101, timestamp: new Date('invalid') }, // 6. VALUE mismatch & 7. INVALID_DATE
    ['level1'], // 8. ARRAY_LENGTH mismatch (nested)
  ],
  metadata: {
    lastSeen: new Date('2025-01-01'), // 9. DATE_MISMATCH (value)
    version: 1.0,
    // tags: []                   // 10. KEY_LENGTH_MISMATCH (missing key 'tags')
  },
  // extra missing                // 11. MISSING_KEY at root
};

const res = compareObjects(objectA, objectB, '', { nameA: 'objA', nameB: 'objB' });
console.log(res);
