import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dateOnlyToDate } from '../src/date-only';

describe('asDate', () => {
	it('should return a Date object for a valid DateOnly object', () => {
		assert.deepStrictEqual(
			dateOnlyToDate(
				{
					year: 2023,
					month: 10,
					day: 15,
				},
				undefined
			),
			new Date(2023, 9, 15)
		);
	});

	it('should return a Date object for a valid DateOnly object with a timezone', () => {
		const expected = new Date(Date.UTC(2025, 6, 14, 21, 0, 0, 0));
		assert.deepStrictEqual(
			dateOnlyToDate(
				{
					year: 2025,
					month: 7,
					day: 15,
				},
				'Africa/Cairo'
			),
			expected
		);
	});

	it('should return same Date object for a valid Date object', () => {
		const date = new Date(2023, 9, 15);
		assert.strictEqual(date, date);
	});
});
