import { describe, it } from 'node:test';
import { durationFormatter } from '@code-art-eg/globalite';
import assert from 'node:assert/strict';

describe('DurationFormatter', () => {
	it('should format zero with default value and en locale', () => {
		const formatter = durationFormatter('en');

		assert.strictEqual(formatter(0), '0:00');
	});

	it('should format small value with short and en locale', () => {
		const formatter = durationFormatter('en', 'short');

		assert.strictEqual(formatter(1), '0:00:00.001');
	});

	it('should format NaN with short and en locale', () => {
		const formatter = durationFormatter('en', 'short');

		assert.strictEqual(formatter(NaN), '');
	});

	it('should throw an error for Infinity with default value and en locale', () => {
		const formatter = durationFormatter('en');
		assert.throws(() => {
			formatter(Infinity);
		}, new Error('Invalid duration'));
	});

	it('should throw an error for -Infinity with default value and en locale', () => {
		const formatter = durationFormatter('en');
		assert.throws(() => {
			formatter(-Infinity);
		}, new Error('Invalid duration'));
	});

	it('should throw an error for an invalid pattern', () => {
		assert.throws(() => {
			durationFormatter('en', 'invalid-pattern');
		}, new Error('Invalid duration pattern'));
	});

	it('should return the same function', () => {
		const formatter = durationFormatter('en', 'short');
		const formatter2 = durationFormatter('en', '[-][d:]h:mm[:ss[.FFF]]');

		assert.strictEqual(formatter, formatter2);
	});

	it('should format positive with default value and en locale', () => {
		const formatter = durationFormatter('en');
		const date1 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const date2 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '1:8:40:50.06');
	});

	it('should format positive with constant format and en locale', () => {
		const formatter = durationFormatter('en', 'constant');
		const date1 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const date2 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '1:08:40:50.060');
	});

	it('should format positive with long format and en locale', () => {
		const formatter = durationFormatter('en', 'long');
		const date1 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const date2 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '1:08:40:50.060');
	});

	it('should format positive with [-]hh mm and en locale', () => {
		const formatter = durationFormatter('en', '[-]hh\\ mm');
		const date1 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const date2 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '08 40');
	});

	it('should format negative with default value and en locale', () => {
		const formatter = durationFormatter('en');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '-1:8:40:50.06');
	});

	it('should format negative with constant format and en locale', () => {
		const formatter = durationFormatter('en', 'constant');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '-1:08:40:50.060');
	});

	it('should format negative with long format and en locale', () => {
		const formatter = durationFormatter('en', 'long');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '-1:08:40:50.060');
	});

	it('should format negative with [-]hh mm and en locale', () => {
		const formatter = durationFormatter('en', '[-]hh\\ mm');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '-08 40');
	});

	it('should format with ss and en locale', () => {
		const formatter = durationFormatter('en', 'ss');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '50');
	});

	it('should format with "aa" and en locale', () => {
		const formatter = durationFormatter('en', '"aa"');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), 'aa');
	});

	it('should format with default value and de locale', () => {
		const formatter = durationFormatter('de');
		const date1 = new Date(2000, 0, 1, 0, 0, 0, 0);
		const date2 = new Date(2000, 0, 2, 8, 40, 50, 60);
		const duration = date1.valueOf() - date2.valueOf();

		assert.strictEqual(formatter(duration), '-1:8:40:50,06');
	});
});
