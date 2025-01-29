import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getMonthName } from '../src/get-month-name';

describe('getMonthName', () => {
	const testCases = [
		{
			locale: 'en-US',
			format: 'long' as const,
			month: 0,
			expected: 'January',
		},
		{
			locale: 'de-DE',
			format: 'short' as const,
			month: 0,
			expected: 'Jan',
		},
		{ locale: 'fr-FR', format: 'narrow' as const, month: 0, expected: 'J' },
		{
			locale: 'es-ES',
			format: 'long' as const,
			month: 1,
			expected: 'febrero',
		},
		{
			locale: 'it-IT',
			format: 'short' as const,
			month: 2,
			expected: 'mar',
		},
		{
			locale: 'ar-sa',
			format: 'long' as const,
			month: 0,
			expected: 'محرم',
			calendar: 'islamic' as const,
		},
		{
			locale: 'en',
			format: 'short' as const,
			month: 8,
			expected: 'Ram.',
			calendar: 'islamic' as const,
		},
	];

	testCases.forEach(({ locale, format, month, expected, calendar }) => {
		it(`should return the correct month name for locale ${locale}, format ${format}, and month ${month} with ${calendar} calendar`, () => {
			const result = getMonthName(locale, month, format, calendar);
			assert.strictEqual(result, expected);
		});
	});
});
