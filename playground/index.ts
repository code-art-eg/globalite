import { numberParser } from '../src/number-parser';

const parser = numberParser('ar-EG', 'f');

const result = parser('-١٢٣٤');

console.log(result);
