import { compareObjects } from '.';

const objA = {
  x: 3,
  a: 1,
  b: ['a', 'b', 'c'],
  c: {
    x: 123,
    y: {
      z: [1, 2],
      m: [{ a: 1, b: 2, c: ['a', 'b', 'c'] }],
    },
  },
};
const objB = {
  a: 12,
  z: 3,
  b: ['a', 'b', 'c2', 'd'],
  c: {
    x: 1234,
    y: {
      z: [1, 2, 3],
      m: [{ a: 1, b: 2, c: ['a', 'b', 'c'] }],
    },
  },
};
const res = compareObjects(objA, objB, '', { nameA: 'objA', nameB: 'objB' });
console.log(res);
