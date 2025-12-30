import { compareObjects } from '.';

const expected = { created: new Date('2024-01-01'), x: [1, 2, 43, 23, 3421, 321] };
const actual = { created: new Date('2024-06-01'), x: [1, 2, 34, 523, 3421, 321] };

const res = compareObjects(expected, actual);
console.log(res);
