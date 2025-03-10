import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isDateOnly } from '@code-art-eg/globalite';

describe('isDateOnly', () => {
	it('should return true for a valid DateOnly', () => {
		assert.strictEqual(
			isDateOnly({
				year: 2023,
				month: 10,
				day: 15,
			}),
			true
		);
	});

	it('should return false for a invalid DateOnly ', () => {
		assert.strictEqual(
			isDateOnly({
				year: -1,
				month: 10,
				day: 15,
			}),
			false
		);
	});

	it('should return false for a non integer values DateOnly ', () => {
		assert.strictEqual(
			isDateOnly({
				year: 2000.5,
				month: 10,
				day: 15,
			}),
			false
		);
	});

	it('should return false for a invalid DateOnly in non leap year', () => {
		assert.strictEqual(
			isDateOnly({
				year: 1900,
				month: 2,
				day: 29,
			}),
			false
		);
	});

	it('should return false for an invalid DateOnly string', () => {
		assert.strictEqual(isDateOnly('2023-12-10'), false);
	});

	it('should return false for a string with time component', () => {
		assert.strictEqual(isDateOnly('2023-10-15T10:00:00'), false);
	});

	it('should return false for a non-date string', () => {
		assert.strictEqual(isDateOnly('not-a-date'), false);
	});

	it('should return false for an empty string', () => {
		assert.strictEqual(isDateOnly(''), false);
	});

	it('should return false for a null value', () => {
		assert.strictEqual(isDateOnly(null), false);
	});

	it('should return false for an undefined value', () => {
		assert.strictEqual(isDateOnly(undefined), false);
	});
});
