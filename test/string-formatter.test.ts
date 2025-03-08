// noinspection SpellCheckingInspection

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { formatString } from '@code-art-eg/globalite';

describe('formatString', () => {
	const testCases = [
		{
			locale: 'en',
			format: 'Hello {name}! I am {age:d} years old. Today is {date:D}. Boolean value is {b}.',
			args: [
				{
					name: 'world',
					age: 19,
					date: new Date('2023-10-10'),
					b: true,
				},
			],
			expected:
				'Hello world! I am 19 years old. Today is Tuesday, October 10, 2023. Boolean value is yes.',
		},
		{
			locale: 'en-US',
			format: 'Hello, {0} {1}!',
			args: ['John', 'Doe'],
			expected: 'Hello, John Doe!',
		},
		{
			locale: 'de',
			format: 'Hallo {name}! Ich bin {age:d} Jahre alt. Heute ist {date:D}. Boolean-Wert ist {b}.',
			args: [
				{
					name: 'welt',
					age: 19,
					date: new Date('2023-10-10'),
					b: false,
				},
			],
			expected:
				'Hallo welt! Ich bin 19 Jahre alt. Heute ist Dienstag, 10. Oktober 2023. Boolean-Wert ist nein.',
		},
		{
			locale: 'ar-EG',
			format: 'مرحبًا {name}! عمري {age:d} سنة. اليوم هو {date:D}. القيمة المنطقية هي {b}.',
			args: [
				{
					name: 'العالم',
					age: 19,
					date: new Date('2023-10-10'),
					b: true,
				},
			],
			expected:
				'مرحبًا العالم! عمري ١٩ سنة. اليوم هو الثلاثاء، ١٠ أكتوبر ٢٠٢٣. القيمة المنطقية هي نعم.',
		},
		{
			locale: 'en',
			format: 'Hello {0}! I am {1:d} years old. Today is {2:D}. Boolean value is {3}.',
			args: ['world', 19, new Date('2023-10-10'), false],
			expected:
				'Hello world! I am 19 years old. Today is Tuesday, October 10, 2023. Boolean value is no.',
		},
		{
			locale: 'de',
			format: 'Hallo {0}! Ich bin {1:d} Jahre alt. Heute ist {2:D}. Boolean-Wert ist {3}.',
			args: ['welt', 19, new Date('2023-10-10'), true],
			expected:
				'Hallo welt! Ich bin 19 Jahre alt. Heute ist Dienstag, 10. Oktober 2023. Boolean-Wert ist ja.',
		},
		{
			locale: 'ar-EG',
			format: 'مرحبًا {0}! عمري {1:d} سنة. اليوم هو {2:D}. القيمة المنطقية هي {3}.',
			args: ['العالم', 19, new Date('2023-10-10'), false],
			expected:
				'مرحبًا العالم! عمري ١٩ سنة. اليوم هو الثلاثاء، ١٠ أكتوبر ٢٠٢٣. القيمة المنطقية هي لا.',
		},
	];

	testCases.forEach(({ locale, format, args, expected }) => {
		it(`should format string correctly for locale ${locale}`, () => {
			const result = formatString(locale, format, ...args);
			assert.strictEqual(result, expected);
		});
	});
});
