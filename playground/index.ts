import { dateParser } from '@code-art-eg/globalite';

const parser = dateParser('en-US', 's');

console.log(parser('2021-07-01T12:34:56'));
