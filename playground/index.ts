import { formatString } from '@code-art-eg/globalite';

const res = formatString(
	'en',
	'Hello {name}! I am {age} years old. Today is {date:D}. Boolean value is {b}.',
	{
		name: 'world',
		age: 19,
		date: new Date(),
		b: true,
	}
);

console.log(res);

const res1 = formatString(
	'en',
	'Hello {0}! I am {1} years old. Today is {2:D}. Boolean value is {3}.',
	'world',
	19,
	new Date(),
	false
);

console.log(res1);
