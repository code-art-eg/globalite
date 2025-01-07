import { dateFormatter } from '@code-art-eg/globalite';

const formatter1 = dateFormatter('en-US', 'd', 'Europe/Berlin');
const date1 = new Date('1000-01-01T00:00:00.000Z');
console.log(formatter1(date1)); // => '01.01.1000'

const formatter2 = dateFormatter('en-US', 'D', 'Asia/Tokyo');
const date2 = new Date('1999-12-31T23:00:00Z'); // it's 2000 in Tokyo
console.log(formatter2(date2)); // => 'Saturday, 01 January 2000'

const formatter3 = dateFormatter('en-US', 'd', 'America/Los_Angeles');
const date3 = new Date('2000-01-01T00:00:00.000Z'); // it's still 1999 in LA
console.log(formatter3(date3)); // => '31.12.1999'
