// noinspection SpellCheckingInspection

import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { booleanFormatter } from '../src';

describe('booleanFormatter', () => {
	const testCases = [
		{ locale: 'en', trueValue: 'yes', falseValue: 'no' },
		{ locale: 'en-GB', trueValue: 'yes', falseValue: 'no' },
		{ locale: 'ar', trueValue: 'نعم', falseValue: 'لا' },
		{ locale: 'ar-EG', trueValue: 'نعم', falseValue: 'لا' },
		{ locale: 'de', trueValue: 'ja', falseValue: 'nein' },
		{ locale: 'de-DE', trueValue: 'ja', falseValue: 'nein' },
	];

	testCases.forEach(({ locale, trueValue, falseValue }) => {
		it(`should format boolean values correctly for locale ${locale}`, () => {
			const formatter = booleanFormatter(locale);
			assert.strictEqual(formatter(true), trueValue);
			assert.strictEqual(formatter(false), falseValue);
		});
	});
});
