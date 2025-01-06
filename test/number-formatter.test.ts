import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { numberFormatter } from '../src/number-formatter';

describe('Default number formatting with no specifier', () => {
	it('Correctly formats in en-US locale using default specifier', () => {
		const formatter = numberFormatter('en-US');
		assert.strictEqual(formatter(1234567.89), '1,234,567.89');
	});

	it('Correctly formats in de-DE locale using default specifier', () => {
		const formatter = numberFormatter('de-DE');
		assert.strictEqual(formatter(1234567.89), '1.234.567,89');
	});

	it('Correctly formats in ar-EG locale using default specifier', () => {
		const formatter = numberFormatter('ar-EG');
		assert.strictEqual(formatter(1234567.89), '1.234.567,89');
	});
});

describe('Formatter caching', () => {
	it('Correctly caches formatters', () => {
		const formatter1 = numberFormatter('en-US', 'n');
		const formatter2 = numberFormatter('en-US', 'N');
		assert.strictEqual(formatter1, formatter2);
	});

	it('Correctly caches formatters with different specifiers', () => {
		const formatter1 = numberFormatter('en-US', 'n');
		const formatter2 = numberFormatter('en-US', 'n2');
		assert.notStrictEqual(formatter1, formatter2);
	});
});

describe('Binary formatting with "B" specifier.', () => {
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
});

describe('Hexadecimal formatting with "X" specifier', () => {
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

describe('Currency formatting with "C" specifier', () => {
	it('Formats USD currency using US Locale', () => {
		const formatter = numberFormatter('en-US', 'cUSD');
		assert.strictEqual(formatter(123.456), '$123.46');
	});

	it('Formats -negative EUR currency using de-DE Locale and C3', () => {
		const formatter = numberFormatter('de-DE', 'cEUR3');
		assert.strictEqual(formatter(-123.456), '-123,456 €');
	});

	it('Formats -negative EGP currency using ar-EG Locale', () => {
		const formatter = numberFormatter('ar-EG', 'cEGP');
		assert.strictEqual(formatter(-123.456), '؜-‏١٢٣٫٤٦ ج.م.‏');
	});
});

describe('Integer formatting with "D" specifier', () => {
	it('Formats number using US Locale and "D" specifier', () => {
		const formatter = numberFormatter('en-US', 'D');
		assert.strictEqual(formatter(1234), '1234');
	});

	it('Formats number using US Locale and "D6" specifier', () => {
		const formatter = numberFormatter('en-US', 'D6');
		assert.strictEqual(formatter(-1234), '-001234');
	});

	it('Throws when formatting non integer with "D" specifier', () => {
		const formatter = numberFormatter('en-US', 'D');
		assert.throws(() => formatter(1234.5), {
			message: 'Number must be an integer',
		});
	});
});

describe('Exponential formatting with "E" specifier', () => {
	it('Formats number using US Locale and "E" specifier', () => {
		const formatter = numberFormatter('en-US', 'E');
		assert.strictEqual(formatter(1052.0329112756), '1.052033E3');
	});

	it('Formats number using US Locale and "E2" specifier', () => {
		const formatter = numberFormatter('en-US', 'E2');
		assert.strictEqual(formatter(1052.0329112756), '1.05E3');
	});
});

describe('Fixed-point formatting with "F" specifier', () => {
	it('Formats number using US Locale and "F" specifier', () => {
		const formatter = numberFormatter('en-US', 'F');
		assert.strictEqual(formatter(1234.567), '1234.57');
	});

	it('Formats number using US Locale and "F1" specifier', () => {
		const formatter = numberFormatter('en-US', 'F1');
		assert.strictEqual(formatter(1234), '1234.0');
	});

	it('Formats number using US Locale and "F4" specifier', () => {
		const formatter = numberFormatter('en-US', 'F4');
		assert.strictEqual(formatter(1234.56), '1234.5600');
	});
});

describe('General formatting with "G" specifier', () => {
	it('Formats number using US Locale and "G" specifier', () => {
		const formatter = numberFormatter('en-US', 'G');
		assert.strictEqual(formatter(-123.456), '-123.456');
	});

	it('Formats number using US Locale and "G4" specifier', () => {
		const formatter = numberFormatter('en-US', 'G4');
		assert.strictEqual(formatter(123.456), '123.5');
	});

	it('Formats small number using US Locale and "G" specifier', () => {
		const formatter = numberFormatter('en-US', 'G');
		assert.strictEqual(formatter(-1.23456789e-25), '-1.23456789E-25');
	});
});

describe('Number formatting with "N" specifier', () => {
	it('Formats number using US Locale and "N" specifier', () => {
		const formatter = numberFormatter('en-US', 'N');
		assert.strictEqual(formatter(1234567.89), '1,234,567.89');
	});

	it('Formats number using US Locale and "N4" specifier', () => {
		const formatter = numberFormatter('en-US', 'N4');
		assert.strictEqual(formatter(1234567.89), '1,234,567.8900');
	});
});

describe('Percentage formatting with "P" specifier', () => {
	it('Formats number using US Locale and "P" specifier', () => {
		const formatter = numberFormatter('en-US', 'P');
		assert.strictEqual(formatter(0.123), '12.30%');
	});

	it('Formats number using US Locale and "P2" specifier', () => {
		const formatter = numberFormatter('en-US', 'P1');
		assert.strictEqual(formatter(-0.39678), '-39.7%');
	});
});

describe('Round trip formatting with "R" specifier', () => {
	it('Formats number using US Locale and "R" specifier', () => {
		const formatter = numberFormatter('en-US', 'R');
		assert.strictEqual(formatter(1234567.89), '1234567.89');
	});

	it('Formats number using US Locale and "R4" specifier', () => {
		const formatter = numberFormatter('en-US', 'R');
		assert.strictEqual(formatter(1234567.891454), '1234567.891454');
	});
});
