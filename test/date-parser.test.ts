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

describe('Date Parser with d format', () => {
	it('Correctly parses date string with en-US locale', () => {
		const parser = dateParser('en-US', 'd');
		const date = parser('12/31/2020');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Correctly parses date string with de-DE locale', () => {
		const parser = dateParser('de-DE', 'd');
		const date = parser('31.12.2020');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Correctly parses date string with ar-EG locale', () => {
		const parser = dateParser('ar-EG', 'd');
		const date = parser('٣١/١٢/٢٠٢٠');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Returns null for invalid date string', () => {
		const parser = dateParser('en-US', 'd');
		const date = parser('invalid-date-string');
		assert.strictEqual(date, null);
	});
});

describe('Date Parser with D format', () => {
	it('Correctly parses date string with en-US locale', () => {
		const parser = dateParser('en-US', 'D');
		const date = parser('Thursday, December 31, 2020');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Correctly parses date string with de-DE locale', () => {
		const parser = dateParser('de-DE', 'D');
		const date = parser('Donnerstag, 31. Dezember 2020');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Correctly parses date string with ar-EG locale', () => {
		const parser = dateParser('ar-EG', 'D');
		const date = parser('الخميس، ٣١ ديسمبر ٢٠٢٠');
		assert.deepStrictEqual(date, new Date(2020, 11, 31));
	});

	it('Returns null for invalid date string', () => {
		const parser = dateParser('en-US', 'D');
		const date = parser('invalid-date-string');
		assert.strictEqual(date, null);
	});
});

describe('Date Parser with F format', () => {
	it('Correctly parses date string with en-US locale', () => {
		const parser = dateParser('en-US', 'F');
		const date = parser('Thursday, December 31, 2020 at 12:34:56 PM');
		assert.deepStrictEqual(date, new Date(2020, 11, 31, 12, 34, 56));
	});

	it('Correctly parses date string with de-DE locale', () => {
		const parser = dateParser('de-DE', 'F');
		const date = parser('Donnerstag, 31. Dezember 2020 um 12:34:56');
		assert.deepStrictEqual(date, new Date(2020, 11, 31, 12, 34, 56));
	});

	it('Correctly parses date string with ar-EG locale', () => {
		const parser = dateParser('ar-EG', 'F');
		const date = parser('الخميس، ٣١ ديسمبر ٢٠٢٠ في ١٢:٣٤:٥٦ م');
		assert.deepStrictEqual(date, new Date(2020, 11, 31, 12, 34, 56));
	});

	it('Returns null for invalid date string', () => {
		const parser = dateParser('en-US', 'F');
		const date = parser('invalid-date-string');
		assert.strictEqual(date, null);
	});
});
