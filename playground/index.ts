import { numberFormatter } from '../src/number-formatter';

const formatter = numberFormatter('en', 'd');

const result = formatter(123456789.12345679);

console.log(result);
