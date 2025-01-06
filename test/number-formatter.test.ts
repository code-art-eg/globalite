import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { numberFormatter } from '../src/number-formatter';

describe('Number formatting', () => {
	it('Correctly formats in en-US locale using default specifier', () => {
		const formatter = numberFormatter('en-US');
		assert.strictEqual(formatter(1234567.89), '1,234,567.89');
	});

	it('Throws an error formatting a non integer with "b" specifier', () => {
		const formatter = numberFormatter('en-US', 'b');
		assert.throws(() => formatter(1.2), {
			message: 'Number must be an integer',
		});
	});

	it('Correctly formats using "b" specifier', () => {
		const formatter = numberFormatter('en-US', 'b');
		assert.strictEqual(formatter(123), '1111011');
	});

	it('Correctly formats using "b5" specifier', () => {
		const formatter = numberFormatter('en-US', 'b5');
		assert.strictEqual(formatter(4), '00100');
	});

	it('Correctly formats negative number using "b" specifier', () => {
		const formatter = numberFormatter('en-US', 'b5');
		assert.strictEqual(formatter(-4), '11111111111111111111111111111100');
	});

	it('Throws on formatting min negative number using "b" specifier', () => {
		const formatter = numberFormatter('en-US', 'b');
		assert.throws(() => formatter(Number.MIN_SAFE_INTEGER), {
			message: 'Number is too small to be represented',
		});
	});

	it('Throws an error formatting a non integer with "x" specifier', () => {
		const formatter = numberFormatter('en-US', 'x');
		assert.throws(() => formatter(1.2), {
			message: 'Number must be an integer',
		});
	});

	it('Correctly formats using "x" specifier', () => {
		const formatter = numberFormatter('en-US', 'x');
		assert.strictEqual(formatter(123), '7b');
	});

	it('Correctly formats using "x5" specifier', () => {
		const formatter = numberFormatter('en-US', 'x5');
		assert.strictEqual(formatter(4), '00004');
	});

	it('Correctly formats negative number using "x" specifier', () => {
		const formatter = numberFormatter('en-US', 'x5');
		assert.strictEqual(formatter(-2140999224), '8062f1c8');
	});

	it('Throws on formatting min negative number using "x" specifier', () => {
		const formatter = numberFormatter('en-US', 'b');
		assert.throws(() => formatter(Number.MIN_SAFE_INTEGER), {
			message: 'Number is too small to be represented',
		});
	});
});
