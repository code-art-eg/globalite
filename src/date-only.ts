/**
 * represents a Date without time components
 */
export type DateOnly = {
	/**
	 * year component of the date
	 */
	year: number;
	/**
	 * month component of the date 1-based (1-12) unlike JavaScript Date object which is 0-based
	 */
	month: number;
	/**
	 * day component of the date
	 * The day component is 1-based (1-31)
	 * The day component is validated based on the month and year
	 * For example, February 29 is only valid in leap years
	 */
	day: number;
};

const monthDays: number[] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Check if the given value is a valid DateOnly object.
 * @param v
 * An object with year, month, and day properties that are numbers, integers and valid range
 * Valid ranges are from 1/1/0000 to 12/31/9999
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
		let daysInMonth = monthDays[v.month - 1];
		if (
			v.month === 2 &&
			v.year % 4 === 0 &&
			(v.year % 100 !== 0 || v.year % 400 === 0)
		) {
			daysInMonth = 29;
		}
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
 */
export function asDate(
	date: Date | DateOnly,
	timeZone: string | undefined
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
