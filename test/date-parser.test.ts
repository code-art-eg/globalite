import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { dateParser } from '@code-art-eg/globalite';

describe('Date Parser with locale independent formats"', () => {
	it('Correctly parses date string with specifier "o"', () => {
		const parser = dateParser('en-US', 'o');
		const date = parser('2021-07-01T12:34:56');
		assert.deepStrictEqual(date, new Date('2021-07-01T12:34:56Z'));
	});

	it('Correctly parses date string with specifier "s"', () => {
		const parser = dateParser('en-US', 's');
		const date = parser('2021-07-01T12:34:56');
		assert.deepStrictEqual(date, new Date('2021-07-01T12:34:56Z'));
	});

	it('Correctly parses date string with specifier "u"', () => {
		const parser = dateParser('en-US', 'u');
		const date = parser('2021-07-01 12:34:56Z');
		assert.deepStrictEqual(date, new Date('2021-07-01T12:34:56Z'));
	});

	it('Correctly parses date string with specifier "R"', () => {
		const parser = dateParser('en-US', 'R');
		const date = parser('Thu, 01 Jul 2021 12:34:56 GMT');
		assert.deepStrictEqual(date, new Date('2021-07-01T12:34:56Z'));
	});

	it('Throws error for invalid specifier', () => {
		assert.throws(() => {
			dateParser('en-US', 'invalid-specifier');
		}, /Invalid date time format specifier/);
	});

	it('Caches parsers', () => {
		const parser1 = dateParser('en-US', 's');
		const parser2 = dateParser('de-DE', 's');
		assert.strictEqual(parser1, parser2);
	});
});
