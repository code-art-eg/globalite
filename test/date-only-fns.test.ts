import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
	today,
	dateToDateOnly,
	tomorrow,
	yesterday,
	addDays,
	addMonths,
	addYears,
	compareDateOnly,
	startOfMonth,
	endOfMonth,
	startOfYear,
	endOfYear,
} from '@code-art-eg/globalite';

describe('today', () => {
	it('should return the current date as a DateOnly object', () => {
		const now = new Date();
		const result = today();

		assert.strictEqual(result.year, now.getFullYear());
		assert.strictEqual(result.month, now.getMonth() + 1);
		assert.strictEqual(result.day, now.getDate());
	});
});

describe('dateToDateOnly', () => {
	it('should convert a Date object to a DateOnly object', () => {
		const date = new Date(2023, 10, 25); // November 25, 2023
		const result = dateToDateOnly(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 11,
			day: 25,
		});
	});

	it('should handle leap years correctly', () => {
		const date = new Date(2024, 1, 29); // February 29, 2024 (leap year)
		const result = dateToDateOnly(date);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 29,
		});
	});
});

describe('tomorrow', () => {
	it('should return the date for tomorrow as a DateOnly object', () => {
		const now = new Date();
		const expected = new Date();
		expected.setDate(now.getDate() + 1);

		const result = tomorrow();

		assert.strictEqual(result.year, expected.getFullYear());
		assert.strictEqual(result.month, expected.getMonth() + 1);
		assert.strictEqual(result.day, expected.getDate());
	});
});

describe('yesterday', () => {
	it('should return the date for yesterday as a DateOnly object', () => {
		const now = new Date();
		const expected = new Date();
		expected.setDate(now.getDate() - 1);

		const result = yesterday();

		assert.strictEqual(result.year, expected.getFullYear());
		assert.strictEqual(result.month, expected.getMonth() + 1);
		assert.strictEqual(result.day, expected.getDate());
	});
});

describe('addDays', () => {
	it('should add days to a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addDays(date, 5);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 11,
			day: 30,
		});
	});

	it('should subtract days from a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addDays(date, -10);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 11,
			day: 15,
		});
	});

	it('should handle month boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addDays(date, 10);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 5,
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2023, 11, 25)); // December 25, 2023
		const result = addDays(date, 10);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 1,
			day: 4,
		});
	});
});

describe('addMonths', () => {
	it('should add months to a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 0, 31)); // January 31, 2023
		const result = addMonths(date, 1);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 2,
			day: 28, // February 28, 2023 (non-leap year)
		});
	});

	it('should subtract months from a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addMonths(date, -1);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 10,
			day: 25, // October 25, 2023
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addMonths(date, 2);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 1,
			day: 25, // January 25, 2024
		});
	});

	it('should handle leap years correctly', () => {
		const date = dateToDateOnly(new Date(2024, 0, 31)); // January 31, 2024 (leap year)
		const result = addMonths(date, 1);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 29, // February 29, 2024 (leap year)
		});
	});

	it('should handle adding many months correctly', () => {
		const date = dateToDateOnly(new Date(2023, 0, 31)); // January 31, 2023
		const result = addMonths(date, 14);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 3,
			day: 31, // March 31, 2024
		});
	});

	it('should handle subtracting many months correctly', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addMonths(date, -14);

		assert.deepStrictEqual(result, {
			year: 2022,
			month: 9,
			day: 25, // September 25, 2022
		});
	});

	it('should handle edge cases with month boundaries', () => {
		const date = dateToDateOnly(new Date(2023, 0, 31)); // January 31, 2023
		const result = addMonths(date, 1);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 2,
			day: 28, // February 28, 2023 (non-leap year)
		});

		const leapYearDate = dateToDateOnly(new Date(2024, 0, 31)); // January 31, 2024 (leap year)
		const leapYearResult = addMonths(leapYearDate, 1);

		assert.deepStrictEqual(leapYearResult, {
			year: 2024,
			month: 2,
			day: 29, // February 29, 2024 (leap year)
		});
	});
});

describe('addYears', () => {
	it('should add years to a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 0, 31)); // January 31, 2023
		const result = addYears(date, 1);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 1,
			day: 31, // January 31, 2024
		});
	});

	it('should subtract years from a DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addYears(date, -1);

		assert.deepStrictEqual(result, {
			year: 2022,
			month: 11,
			day: 25, // November 25, 2022
		});
	});

	it('should handle leap years correctly when adding', () => {
		const date = dateToDateOnly(new Date(2020, 1, 29)); // February 29, 2020 (leap year)
		const result = addYears(date, 4);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 29, // February 29, 2024 (leap year)
		});
	});

	it('should handle leap years correctly when adding 1 year', () => {
		const date = dateToDateOnly(new Date(2020, 1, 29)); // February 29, 2020 (leap year)
		const result = addYears(date, 1);

		assert.deepStrictEqual(result, {
			year: 2021,
			month: 2,
			day: 28, // February 28, 2021 (non-leap year)
		});
	});

	it('should handle leap years correctly when subtracting', () => {
		const date = dateToDateOnly(new Date(2024, 1, 29)); // February 29, 2024 (leap year)
		const result = addYears(date, -4);

		assert.deepStrictEqual(result, {
			year: 2020,
			month: 2,
			day: 29, // February 29, 2020 (leap year)
		});
	});

	it('should handle non-leap years correctly', () => {
		const date = dateToDateOnly(new Date(2023, 1, 28)); // February 28, 2023 (non-leap year)
		const result = addYears(date, 1);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 28, // February 28, 2024 (leap year)
		});
	});

	it('should handle adding many years correctly', () => {
		const date = dateToDateOnly(new Date(2023, 0, 31)); // January 31, 2023
		const result = addYears(date, 10);

		assert.deepStrictEqual(result, {
			year: 2033,
			month: 1,
			day: 31, // January 31, 2033
		});
	});

	it('should handle subtracting many years correctly', () => {
		const date = dateToDateOnly(new Date(2023, 10, 25)); // November 25, 2023
		const result = addYears(date, -10);

		assert.deepStrictEqual(result, {
			year: 2013,
			month: 11,
			day: 25, // November 25, 2013
		});
	});
});

describe('compareDateOnly', () => {
	it('should return 0 for equal dates', () => {
		const date1 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const date2 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023

		const result = compareDateOnly(date1, date2);

		assert.strictEqual(result, 0);
	});

	it('should return a negative value if the first date is before the second date', () => {
		const date1 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const date2 = dateToDateOnly(new Date(2023, 0, 2)); // January 2, 2023

		const result = compareDateOnly(date1, date2);

		assert(result < 0);
	});

	it('should return a positive value if the first date is after the second date', () => {
		const date1 = dateToDateOnly(new Date(2023, 0, 2)); // January 2, 2023
		const date2 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023

		const result = compareDateOnly(date1, date2);

		assert(result > 0);
	});

	it('should correctly compare dates with different years', () => {
		const date1 = dateToDateOnly(new Date(2022, 0, 1)); // January 1, 2022
		const date2 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023

		const result = compareDateOnly(date1, date2);

		assert(result < 0);
	});

	it('should correctly compare dates with different months', () => {
		const date1 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const date2 = dateToDateOnly(new Date(2023, 1, 1)); // February 1, 2023

		const result = compareDateOnly(date1, date2);

		assert(result < 0);
	});

	it('should correctly compare dates with different days', () => {
		const date1 = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const date2 = dateToDateOnly(new Date(2023, 0, 2)); // January 2, 2023

		const result = compareDateOnly(date1, date2);

		assert(result < 0);
	});
});

describe('startOfMonth', () => {
	it('should return the first day of the month for a given DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 0, 15)); // January 15, 2023
		const result = startOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 1,
			day: 1, // January 1, 2023
		});
	});

	it('should handle dates at the end of the month correctly', () => {
		const date = dateToDateOnly(new Date(2023, 1, 28)); // February 28, 2023
		const result = startOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 2,
			day: 1, // February 1, 2023
		});
	});

	it('should handle leap years correctly', () => {
		const date = dateToDateOnly(new Date(2024, 1, 29)); // February 29, 2024 (leap year)
		const result = startOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 1, // February 1, 2024
		});
	});

	it('should handle dates at the start of the month correctly', () => {
		const date = dateToDateOnly(new Date(2023, 2, 1)); // March 1, 2023
		const result = startOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 3,
			day: 1, // March 1, 2023
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2023, 11, 31)); // December 31, 2023
		const result = startOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 1, // December 1, 2023
		});
	});
});

describe('endOfMonth', () => {
	it('should return the last day of the month for a given DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 0, 15)); // January 15, 2023
		const result = endOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 1,
			day: 31, // January 31, 2023
		});
	});

	it('should handle dates at the end of the month correctly', () => {
		const date = dateToDateOnly(new Date(2023, 1, 28)); // February 28, 2023
		const result = endOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 2,
			day: 28, // February 28, 2023
		});
	});

	it('should handle leap years correctly', () => {
		const date = dateToDateOnly(new Date(2024, 1, 29)); // February 29, 2024 (leap year)
		const result = endOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 2,
			day: 29, // February 29, 2024
		});
	});

	it('should handle dates at the start of the month correctly', () => {
		const date = dateToDateOnly(new Date(2023, 2, 1)); // March 1, 2023
		const result = endOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 3,
			day: 31, // March 31, 2023
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2023, 11, 31)); // December 31, 2023
		const result = endOfMonth(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 31, // December 31, 2023
		});
	});
});

describe('startOfYear', () => {
	it('should return the first day of the year for a given DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 5, 15)); // June 15, 2023
		const result = startOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 1,
			day: 1, // January 1, 2023
		});
	});

	it('should handle dates at the end of the year correctly', () => {
		const date = dateToDateOnly(new Date(2023, 11, 31)); // December 31, 2023
		const result = startOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 1,
			day: 1, // January 1, 2023
		});
	});

	it('should handle leap years correctly', () => {
		const date = dateToDateOnly(new Date(2024, 1, 29)); // February 29, 2024 (leap year)
		const result = startOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 1,
			day: 1, // January 1, 2024
		});
	});

	it('should handle dates at the start of the year correctly', () => {
		const date = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const result = startOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 1,
			day: 1, // January 1, 2023
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2022, 11, 31)); // December 31, 2022
		const result = startOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2022,
			month: 1,
			day: 1, // January 1, 2022
		});
	});
});

describe('endOfYear', () => {
	it('should return the last day of the year for a given DateOnly object', () => {
		const date = dateToDateOnly(new Date(2023, 5, 15)); // June 15, 2023
		const result = endOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 31, // December 31, 2023
		});
	});

	it('should handle dates at the end of the year correctly', () => {
		const date = dateToDateOnly(new Date(2023, 11, 31)); // December 31, 2023
		const result = endOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 31, // December 31, 2023
		});
	});

	it('should handle leap years correctly', () => {
		const date = dateToDateOnly(new Date(2024, 1, 29)); // February 29, 2024 (leap year)
		const result = endOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2024,
			month: 12,
			day: 31, // December 31, 2024
		});
	});

	it('should handle dates at the start of the year correctly', () => {
		const date = dateToDateOnly(new Date(2023, 0, 1)); // January 1, 2023
		const result = endOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2023,
			month: 12,
			day: 31, // December 31, 2023
		});
	});

	it('should handle year boundaries correctly', () => {
		const date = dateToDateOnly(new Date(2022, 11, 31)); // December 31, 2022
		const result = endOfYear(date);

		assert.deepStrictEqual(result, {
			year: 2022,
			month: 12,
			day: 31, // December 31, 2022
		});
	});
});
