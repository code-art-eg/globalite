/**
 * represents a Date without time components
 */
export type DateOnly = {
	/**
	 * year component of the date
	 */
	readonly year: number;
	/**
	 * month component of the date 1-based (1-12) unlike JavaScript Date object which is 0-based
	 */
	readonly month: number;
	/**
	 * day component of the date
	 * The day component is 1-based (1-31)
	 * The day component is validated based on the month and year
	 * For example, February 29 is only valid in leap years
	 */
	readonly day: number;
};

const daysInMonth365: number[] = [
	31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];
const daysInMonth366: number[] = [
	31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
];

const daysToMonth365: number[] = [
	0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365,
];
const daysToMonth366: number[] = [
	0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366,
];

function isLeapYear(year: number): boolean {
	return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function getDaysInMonth(year: number, month: number): number {
	return isLeapYear(year)
		? daysInMonth366[month - 1]
		: daysInMonth365[month - 1];
}

/**
 * Check if the given value is a valid DateOnly object.
 * @param v
 * An object with year, month, and day properties that are numbers, integers and valid range
 * Valid ranges are from 1/1/0000 to 12/31/9999
 * @returns true if the value is a valid DateOnly object with valid year, month, and day
 * It checks if the month is between 1 and 12, and the day is between 1 and the number of days in the month
 * handling leap years
 */
export function isDateOnly(v: unknown): v is DateOnly {
	if (v === null) {
		return false;
	}
	if (typeof v !== 'object') {
		return false;
	}

	if (
		'year' in v &&
		'month' in v &&
		'day' in v &&
		typeof v.year === 'number' &&
		typeof v.month === 'number' &&
		typeof v.day === 'number' &&
		Number.isInteger(v.year) &&
		Number.isInteger(v.month) &&
		Number.isInteger(v.day) &&
		v.year >= 0 &&
		v.year <= 9999 &&
		v.month >= 1 &&
		v.month <= 12 &&
		v.day >= 1
	) {
		const daysInMonth = getDaysInMonth(v.year, v.month);
		return v.day <= daysInMonth;
	}
	return false;
}

const timeZoneMatch = /^GMT(?:([+-]\d{1,2})(?::(\d{2}))?)?$/;

function getTimezoneOffsetMinutes(date: Date, timeZone: string): number {
	const options: Intl.DateTimeFormatOptions = {
		timeZone,
		timeZoneName: 'longOffset',
		month: '2-digit',
		day: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	};
	const formatter = new Intl.DateTimeFormat('en-US', options);
	const parts = formatter.formatToParts(date);
	const timeZonePart = parts.find(part => part.type === 'timeZoneName');
	if (!timeZonePart) {
		throw new Error('Unable to determine time zone offset');
	}
	const match = timeZoneMatch.exec(timeZonePart.value);
	if (!match) {
		throw new Error(
			`Unable to determine time zone offset, invalid format: ${timeZonePart.value}`
		);
	}
	const hours = parseInt(match[1] || '00', 10);
	const minutes = parseInt(match[2] || '00', 10);
	return hours * 60 + (hours < 0 ? -minutes : minutes);
}

/**
 * converts a DateOnly to JavaScript Date if it's not already a Date
 * This is so that DateOnly can be formatted using Intl.DateTimeFormat
 * @param date - the Date or DateOnly to convert
 * @param timeZone - the time zone to use when converting a DateOnly to a Date
 * Default is the local time zone
 */
export function dateOnlyToDate(
	date: Date | DateOnly,
	timeZone?: string | undefined
): Date {
	if (isDateOnly(date)) {
		// Get the time zone offset in minutes

		if (timeZone) {
			const d = new Date(
				Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0, 0)
			);
			date = new Date(
				d.getTime() - getTimezoneOffsetMinutes(d, timeZone) * 60000
			);
			// We do it twice to handle daylight saving time change edge cases correctly
			date = new Date(
				d.getTime() - getTimezoneOffsetMinutes(date, timeZone) * 60000
			);
		} else {
			date = new Date(date.year, date.month - 1, date.day, 0, 0, 0, 0);
		}
	}
	return date;
}

/**
 * converts a JavaScript Date to a DateOnly object
 * @param date - the Date to convert
 */
export function dateToDateOnly(date: Date): DateOnly {
	return Object.freeze({
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
	});
}

/**
 * Get the current date as a DateOnly object
 */
export function today(): DateOnly {
	const now = new Date();
	return Object.freeze({
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
	});
}

/**
 * Get the date for tomorrow as a DateOnly object
 */
export function tomorrow(): DateOnly {
	const now = new Date();
	now.setDate(now.getDate() + 1);
	return Object.freeze({
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
	});
}

/**
 * Get the date for yesterday as a DateOnly object
 */
export function yesterday(): DateOnly {
	const now = new Date();
	now.setDate(now.getDate() - 1);
	return Object.freeze({
		year: now.getFullYear(),
		month: now.getMonth() + 1,
		day: now.getDate(),
	});
}

/**
 * Add days to a DateOnly object and return a new DateOnly object
 * @param date - the DateOnly object to add days to
 * @param days - the number of days to add (can be negative to subtract days). Must be an integer. Can be positive, zero or negative.
 * @returns a new DateOnly object with the added days
 */
export function addDays(date: DateOnly, days: number): DateOnly {
	if (!Number.isInteger(days)) {
		throw new Error('days must be an integer');
	}
	const d = new Date(date.year, date.month - 1, date.day);
	d.setDate(d.getDate() + days);

	return Object.freeze({
		year: d.getFullYear(),
		month: d.getMonth() + 1,
		day: d.getDate(),
	});
}

/**
 * Add months to a DateOnly object and return a new DateOnly object
 * @param date - the DateOnly object to add months to
 * @param months - the number of months to add (can be negative to subtract months). Must be an integer. Can be positive, zero or negative.
 * @returns a new DateOnly object with the added months
 */
export function addMonths(date: DateOnly, months: number): DateOnly {
	if (!Number.isInteger(months)) {
		throw new Error('months must be an integer');
	}
	let y = date.year;
	let m = date.month + months;
	let d = date.day;
	const q = m > 0 ? Math.floor((m - 1) / 12) : Math.ceil(m / 12) - 1;
	y += q;
	m -= q * 12;
	if (y < 1 || y > 9999) {
		throw new Error('Year out of range');
	}
	const daysTo = isLeapYear(y) ? daysToMonth366 : daysToMonth365;
	const daysToMonth = daysTo[m - 1];
	const days = daysTo[m] - daysToMonth;
	if (d > days) {
		d = days;
	}

	return Object.freeze({
		year: y,
		month: m,
		day: d,
	});
}

/**
 * Add years to a DateOnly object and return a new DateOnly object
 * @param date - the DateOnly object to add years to
 * @param years - the number of years to add (can be negative to subtract years). Must be an integer. Can be positive, zero or negative.
 * @returns a new DateOnly object with the added years
 */
export function addYears(date: DateOnly, years: number): DateOnly {
	if (!Number.isInteger(years)) {
		throw new Error('years must be an integer');
	}
	const y = date.year + years;
	if (y < 0 || y > 9999) {
		throw new Error('Year out of range');
	}
	if (date.month === 2 && date.day === 29 && !isLeapYear(y)) {
		return Object.freeze({
			year: y,
			month: 2,
			day: 28,
		});
	}
	return Object.freeze({
		year: y,
		month: date.month,
		day: date.day,
	});
}

/**
 * Compare two DateOnly objects
 * @param d1 - the first DateOnly object
 * @param d2 - the second DateOnly object
 * @returns a negative value if d1 is before d2, a positive value if d1 is after d2, or zero if they are the same
 */
export function compareDateOnly(d1: DateOnly, d2: DateOnly): number {
	if (d1.year !== d2.year) {
		return d1.year - d2.year;
	}
	if (d1.month !== d2.month) {
		return d1.month - d2.month;
	}
	return d1.day - d2.day;
}

/**
 * get the start of the month for the given DateOnly object
 */
export function startOfMonth(date: DateOnly): DateOnly {
	return Object.freeze({
		year: date.year,
		month: date.month,
		day: 1,
	});
}

/**
 * get the end of the month for the given DateOnly object
 */
export function endOfMonth(date: DateOnly): DateOnly {
	const d = new Date(date.year, date.month, 0);
	return Object.freeze({
		year: d.getFullYear(),
		month: d.getMonth() + 1,
		day: d.getDate(),
	});
}

/**
 * get the start of the year for the given DateOnly object
 */
export function startOfYear(date: DateOnly): DateOnly {
	return Object.freeze({
		year: date.year,
		month: 1,
		day: 1,
	});
}

/**
 * get the end of the year for the given DateOnly object
 */
export function endOfYear(date: DateOnly): DateOnly {
	return Object.freeze({
		year: date.year,
		month: 12,
		day: 31,
	});
}
