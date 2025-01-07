import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { numberParser } from '@code-art-eg/globalite';

describe('Default number parsing with no specifier', () => {
	it('Correctly parses using en-US locale using default specifier', () => {
		const parser = numberParser('en-US');
		assert.strictEqual(parser('1,234,567.89'), 1234567.89);
	});

	it('Correctly parses using de-DE locale using default specifier', () => {
		const parser = numberParser('de-DE');
		assert.strictEqual(parser('1.234.567,89'), 1234567.89);
	});

	it('Correctly parses negative using ar-EG locale using default specifier', () => {
		const parser = numberParser('ar-EG');
		assert.strictEqual(parser('-١٬٢٣٤٬٥٦٧٫٨٩'), -1234567.89);
	});

	it('Correctly parses NaN using en-US locale using default specifier', () => {
		const parser = numberParser('en-US');
		assert.strictEqual(parser('NaN'), NaN);
	});

	it('Correctly parses Infinity using en-US locale using default specifier', () => {
		const parser = numberParser('en-US');
		assert.strictEqual(parser('∞'), Infinity);
	});

	it('Correctly parses -Infinity using en-US locale using default specifier', () => {
		const parser = numberParser('en-US');
		assert.strictEqual(parser('-∞'), -Infinity);
	});

	it('Returns null when parsing a string that is not a number', () => {
		const parser = numberParser('en-US');
		assert.strictEqual(parser('hello'), null);
	});
});

describe('Parser caching', () => {
	it('Correctly caches parsers', () => {
		const parser1 = numberParser('en-US', 'n');
		const parser2 = numberParser('en-US', 'N');
		assert.strictEqual(parser1, parser2);
	});

	it('Correctly caches locale independent parsers', () => {
		const parser1 = numberParser('en-US', 'b');
		const parser2 = numberParser('de-DE', 'B');
		assert.strictEqual(parser1, parser2);
	});

	it('Correctly caches parsers with different specifiers', () => {
		const parser1 = numberParser('en-US', 'n');
		const parser2 = numberParser('en-US', 'n2');
		assert.notStrictEqual(parser1, parser2);
	});
});

describe('Binary parsing with "B" specifier.', () => {
	it('Correctly parses using "b" specifier', () => {
		const parser = numberParser('en-US', 'b');
		assert.strictEqual(parser('1111011'), 123);
	});

	it('Returns null when parsing a non-binary string with "b" specifier', () => {
		const parser = numberParser('en-US', 'b');
		assert.strictEqual(parser('123'), null);
	});

	it('Returns null when parsing a non-integer with "b" specifier', () => {
		const parser = numberParser('en-US', 'b');
		assert.strictEqual(parser('1.1'), null);
	});
});

describe('Hexadecimal parsing with "X" specifier.', () => {
	it('Correctly parses using "X" specifier', () => {
		const parser = numberParser('en-US', 'X');
		assert.strictEqual(parser('1A'), 26);
	});

	it('Correctly parses using "x" specifier', () => {
		const parser = numberParser('en-US', 'x');
		assert.strictEqual(parser('1a'), 26);
	});

	it('Returns null when parsing a non-hexadecimal string with "X" specifier', () => {
		const parser = numberParser('en-US', 'X');
		assert.strictEqual(parser('1G'), null);
	});

	it('Returns null when parsing a non-integer with "X" specifier', () => {
		const parser = numberParser('en-US', 'X');
		assert.strictEqual(parser('1.1'), null);
	});
});

describe('Round trip parsing with "r" specifier.', () => {
	it('Correctly parses using "r" specifier', () => {
		const parser = numberParser('en-US', 'r');
		assert.strictEqual(parser('1.3e5'), 130000);
	});

	it('Correctly parses using "r" specifier with negative number', () => {
		const parser = numberParser('en-US', 'r');
		assert.strictEqual(parser('-12.25'), -12.25);
	});

	it('Correctly parses using "r" specifier with plus sign', () => {
		const parser = numberParser('en-US', 'r');
		assert.strictEqual(parser('+12.25'), 12.25);
	});

	it('Correctly parses using "r" specifier with small negative number', () => {
		const parser = numberParser('en-US', 'r');
		assert.strictEqual(parser('-1.3e-5'), -0.000013);
	});

	it('Returns null when parsing a non-number with "r" specifier', () => {
		const parser = numberParser('en-US', 'r');
		assert.strictEqual(parser('1hello'), null);
	});
});

describe('Currency parsing with "c" specifier.', () => {
	it('Correctly parses using en-US locale with "c" specifier', () => {
		const parser = numberParser('en-US', 'cUSD');
		assert.strictEqual(parser('$1,234.56'), 1234.56);
	});

	it('Correctly parses negative numbers using en-US locale with "c" specifier', () => {
		const parser = numberParser('en-US', 'cUSD');
		assert.strictEqual(parser('($1,234.56)'), -1234.56);
	});

	it('Correctly parses negative numbers using de-DE locale with "c" specifier', () => {
		const parser = numberParser('de-DE', 'cEUR');
		assert.strictEqual(parser('-1.234,56 €'), -1234.56);
	});

	it('Correctly parses using ar-EG locale with "c" specifier', () => {
		const parser = numberParser('ar-EG', 'cEGP');
		assert.strictEqual(parser('؜-‏١٢٣٫٤٦ ج.م.‏'), -123.46);
	});
});

describe('Percent parsing with "p" specifier.', () => {
	it('Correctly parses using en-US locale with "p" specifier', () => {
		const parser = numberParser('en-US', 'p');
		assert.strictEqual(parser('12.34%'), 0.1234);
	});

	it('Correctly parses using de-DE locale with "p" specifier', () => {
		const parser = numberParser('de-DE', 'p');
		assert.strictEqual(parser('12,34%'), 0.1234);
	});

	it('Correctly parses negative using ar-EG locale with "p" specifier', () => {
		const parser = numberParser('ar-EG', 'p');
		assert.strictEqual(parser('؜-١٢٫٣٤٪؜'), -0.1234);
	});
});

describe('Scientific notation parsing with "e" specifier.', () => {
	it('Correctly parses using en-US locale with "e" specifier', () => {
		const parser = numberParser('en-US', 'e');
		assert.strictEqual(parser('1.23e4'), 12300);
	});

	it('Correctly parses using de-DE locale with "e" specifier', () => {
		const parser = numberParser('de-DE', 'e');
		assert.strictEqual(parser('1,23e4'), 12300);
	});

	it('Correctly parses negative using ar-EG locale with "e" specifier', () => {
		const parser = numberParser('ar-EG', 'e');
		assert.strictEqual(parser('؜-١٫٢٣٥أس٤'), -12350);
	});

	it('Correctly parses small negative using ar-EG locale with "e" specifier', () => {
		const parser = numberParser('ar-EG', 'e');
		assert.strictEqual(parser('؜؜-١٫٢٣أس؜-٣٥'), -1.23e-35);
	});
});

describe('Integer parsing with "d" specifier', () => {
	it('Correctly parses using "d" specifier', () => {
		const parser = numberParser('en-US', 'd');
		assert.strictEqual(parser('1234'), 1234);
	});

	it('Correctly parses using "d6" specifier', () => {
		const parser = numberParser('en-US', 'd6');
		assert.strictEqual(parser('001234'), 1234);
	});

	it('Correctly parses negative number using "d" specifier', () => {
		const parser = numberParser('en-US', 'd');
		assert.strictEqual(parser('-1234'), -1234);
	});

	it('Returns null when parsing non-integer with "d" specifier', () => {
		const parser = numberParser('en-US', 'd');
		assert.strictEqual(parser('1.2'), null);
	});
});

describe('Fixed-point parsing with "f" specifier without grouping', () => {
	it('Correctly parses number using US Locale and "f" specifier', () => {
		const parser = numberParser('en-US', 'f');
		assert.strictEqual(parser('1234.57'), 1234.57);
	});

	it('Correctly parses number using US Locale and "f1" specifier', () => {
		const parser = numberParser('en-US', 'f1');
		assert.strictEqual(parser('1234.0'), 1234.0);
	});

	it('Correctly parses number using US Locale and "f4" specifier', () => {
		const parser = numberParser('en-US', 'f4');
		assert.strictEqual(parser('1234.5600'), 1234.56);
	});

	it('Correctly parses negative number using US Locale and "f2" specifier', () => {
		const parser = numberParser('en-US', 'f2');
		assert.strictEqual(parser('-1234.56'), -1234.56);
	});

	it('Correctly parses zero using US Locale and "f3" specifier', () => {
		const parser = numberParser('en-US', 'f3');
		assert.strictEqual(parser('0.000'), 0.0);
	});

	it('Returns null when parsing number with grouping using "f" specifier', () => {
		const parser = numberParser('en-US', 'f');
		assert.strictEqual(parser('1,234.57'), null);
	});
});

describe('Number parsing with "N" specifier (numbers with grouping)', () => {
	it('Correctly parses number using US Locale and "N" specifier', () => {
		const parser = numberParser('en-US', 'N');
		assert.strictEqual(parser('1,234,567.89'), 1234567.89);
	});

	it('Correctly parses number using German Locale and "N" specifier', () => {
		const parser = numberParser('de-DE', 'N');
		assert.strictEqual(parser('1.234.567,89'), 1234567.89);
	});

	it('Correctly parses negative number using US Locale and "N" specifier', () => {
		const parser = numberParser('en-US', 'N');
		assert.strictEqual(parser('-1,234,567.89'), -1234567.89);
	});

	it('Correctly parses number using Arabic Locale and "N" specifier', () => {
		const parser = numberParser('ar-EG', 'N');
		assert.strictEqual(parser('١٬٢٣٤٬٥٦٧٫٨٩'), 1234567.89);
	});
});

describe('Number parsing with "g" specifier (either exponent or fixed point)', () => {
	it('Correctly parses fixed-point number using "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('1234.56'), 1234.56);
	});

	it('Correctly parses number in scientific notation using "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('1.23456e3'), 1234.56);
	});

	it('Correctly parses negative fixed-point number using "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('-1234.56'), -1234.56);
	});

	it('Correctly parses negative number in scientific notation using "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('-1.23456e3'), -1234.56);
	});

	it('Correctly parses small number in scientific notation using "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('1.23456e-3'), 0.00123456);
	});

	it('Returns null when parsing a string that is not a number with "g" specifier', () => {
		const parser = numberParser('en-US', 'g');
		assert.strictEqual(parser('hello'), null);
	});
});
