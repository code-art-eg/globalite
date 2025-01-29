import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getDayName } from '../src/get-day-name';

describe('getDayName', () => {
	const testCases = [
		{
			locale: 'en-US',
			format: 'long' as const,
			day: 0,
			expected: 'Sunday',
		},
		{ locale: 'en-US', format: 'short' as const, day: 1, expected: 'Mon' },
		{ locale: 'en-US', format: 'narrow' as const, day: 2, expected: 'T' },
		{
			locale: 'ar-EG',
			format: 'long' as const,
			day: 3,
			expected: 'الأربعاء',
		},
		{
			locale: 'ar-EG',
			format: 'short' as const,
			day: 4,
			expected: 'الخميس',
		},
		{ locale: 'ar-EG', format: 'narrow' as const, day: 5, expected: 'ج' },
		{
			locale: 'fr-FR',
			format: 'long' as const,
			day: 6,
			expected: 'samedi',
		},
	];

	testCases.forEach(({ locale, format, day, expected }) => {
		it(`should return the correct day name for locale ${locale}, format ${format}, and day ${day}`, () => {
			const result = getDayName(locale, day, format);
			assert.strictEqual(result, expected);
		});
	});
});
