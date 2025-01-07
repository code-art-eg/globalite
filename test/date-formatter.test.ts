import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { dateFormatter } from '@code-art-eg/globalite';

const testDate = new Date('2008-02-27T13:30:45.678Z');
const testTimeZone = 'Europe/Berlin';

describe('Date Formatter without specifier', () => {
	it('Correctly formats date using en-US locale', () => {
		const formatter = dateFormatter('en-US', '', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wednesday, February 27, 2008 at 2:30 PM'
		);
	});

	it('Correctly formats date using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', '', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Mittwoch, 27. Februar 2008 um 14:30'
		);
	});

	it('Correctly formats date using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', '', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'الأربعاء، ٢٧ فبراير ٢٠٠٨ في ٢:٣٠ م'
		);
	});
});

describe('Date Formatter with d specifier', () => {
	it('Correctly formats date using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'd', testTimeZone);
		assert.strictEqual(formatter(testDate), '2/27/2008');
	});

	it('Correctly formats date using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'd', testTimeZone);
		assert.strictEqual(formatter(testDate), '27.02.2008');
	});

	it('Correctly formats date using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'd', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢٧‏/٢‏/٢٠٠٨');
	});
});

describe('Date Formatter with D specifier', () => {
	it('Correctly formats date using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'D', testTimeZone);
		assert.strictEqual(formatter(testDate), 'Wednesday, February 27, 2008');
	});

	it('Correctly formats date using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'D', testTimeZone);
		assert.strictEqual(formatter(testDate), 'Mittwoch, 27. Februar 2008');
	});

	it('Correctly formats date using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'D', testTimeZone);
		assert.strictEqual(formatter(testDate), 'الأربعاء، ٢٧ فبراير ٢٠٠٨');
	});
});

describe('Date Formatter with f specifier', () => {
	it('Correctly formats date and time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'f', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wednesday, February 27, 2008 at 2:30 PM'
		);
	});

	it('Correctly formats date and time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'f', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Mittwoch, 27. Februar 2008 um 14:30'
		);
	});

	it('Correctly formats date and time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'f', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'الأربعاء، ٢٧ فبراير ٢٠٠٨ في ٢:٣٠ م'
		);
	});
});

describe('Date Formatter with F specifier', () => {
	it('Correctly formats date and time with seconds using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'F', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wednesday, February 27, 2008 at 2:30:45 PM'
		);
	});

	it('Correctly formats date and time with seconds using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'F', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Mittwoch, 27. Februar 2008 um 14:30:45'
		);
	});

	it('Correctly formats date and time with seconds using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'F', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'الأربعاء، ٢٧ فبراير ٢٠٠٨ في ٢:٣٠:٤٥ م'
		);
	});
});

describe('Date Formatter with g specifier', () => {
	it('Correctly formats date and time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'g', testTimeZone);
		assert.strictEqual(formatter(testDate), '2/27/2008, 2:30 PM');
	});

	it('Correctly formats date and time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'g', testTimeZone);
		assert.strictEqual(formatter(testDate), '27.02.2008, 14:30');
	});

	it('Correctly formats date and time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'g', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢٧‏/٢‏/٢٠٠٨، ٢:٣٠ م');
	});
});

describe('Date Formatter with G specifier', () => {
	it('Correctly formats date and time with seconds using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'G', testTimeZone);
		assert.strictEqual(formatter(testDate), '2/27/2008, 2:30:45 PM');
	});

	it('Correctly formats date and time with seconds using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'G', testTimeZone);
		assert.strictEqual(formatter(testDate), '27.02.2008, 14:30:45');
	});

	it('Correctly formats date and time with seconds using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'G', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢٧‏/٢‏/٢٠٠٨، ٢:٣٠:٤٥ م');
	});
});

describe('Date Formatter with m specifier', () => {
	it('Correctly formats date using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'm', testTimeZone);
		assert.strictEqual(formatter(testDate), 'February 27');
	});

	it('Correctly formats date using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'm', testTimeZone);
		assert.strictEqual(formatter(testDate), '27. Februar');
	});

	it('Correctly formats date using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'm', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢٧ فبراير');
	});
});

describe('Date Formatter with o specifier', () => {
	it('Correctly formats date and time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'o', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45.6780000');
	});

	it('Correctly formats date and time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'o', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45.6780000');
	});

	it('Correctly formats date and time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'o', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45.6780000');
	});
});

describe('Date Formatter with r specifier', () => {
	it('Correctly formats date and time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'r', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wed, 27 Feb 2008 13:30:45 GMT'
		);
	});

	it('Correctly formats date and time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'r', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wed, 27 Feb 2008 13:30:45 GMT'
		);
	});

	it('Correctly formats date and time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'r', testTimeZone);
		assert.strictEqual(
			formatter(testDate),
			'Wed, 27 Feb 2008 13:30:45 GMT'
		);
	});
});

describe('Date Formatter with s specifier', () => {
	it('Correctly formats date and time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 's', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45');
	});

	it('Correctly formats date and time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 's', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45');
	});

	it('Correctly formats date and time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 's', testTimeZone);
		assert.strictEqual(formatter(testDate), '2008-02-27T13:30:45');
	});
});

describe('Date Formatter with t specifier', () => {
	it('Correctly formats time using en-US locale', () => {
		const formatter = dateFormatter('en-US', 't', testTimeZone);
		assert.strictEqual(formatter(testDate), '2:30 PM');
	});

	it('Correctly formats time using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 't', testTimeZone);
		assert.strictEqual(formatter(testDate), '14:30');
	});

	it('Correctly formats time using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 't', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢:٣٠ م');
	});
});

describe('Date Formatter with T specifier', () => {
	it('Correctly formats time with seconds using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'T', testTimeZone);
		assert.strictEqual(formatter(testDate), '2:30:45 PM');
	});

	it('Correctly formats time with seconds using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'T', testTimeZone);
		assert.strictEqual(formatter(testDate), '14:30:45');
	});

	it('Correctly formats time with seconds using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'T', testTimeZone);
		assert.strictEqual(formatter(testDate), '٢:٣٠:٤٥ م');
	});
});

describe('Date Formatter with Y specifier', () => {
	it('Correctly formats year and month using en-US locale', () => {
		const formatter = dateFormatter('en-US', 'Y', testTimeZone);
		assert.strictEqual(formatter(testDate), 'February 2008');
	});

	it('Correctly formats year and month using de-DE locale', () => {
		const formatter = dateFormatter('de-DE', 'Y', testTimeZone);
		assert.strictEqual(formatter(testDate), 'Februar 2008');
	});

	it('Correctly formats year and month using ar-EG locale', () => {
		const formatter = dateFormatter('ar-EG', 'Y', testTimeZone);
		assert.strictEqual(formatter(testDate), 'فبراير ٢٠٠٨');
	});
});

describe('Date formatter millennium edge case', () => {
	it('Correctly formats the year 1000', () => {
		const formatter = dateFormatter('en-US', 'd', testTimeZone);
		const date = new Date('1000-01-01T00:00:00.000Z');
		assert.strictEqual(formatter(date), '1/1/1000');
	});

	it('Correctly formats the year 2000 cross timezones in Tokyo', () => {
		const formatter = dateFormatter('en-US', 'd', 'Asia/Tokyo');
		const date = new Date('1999-12-31T23:00:00Z'); // it's 2000 in Tokyo
		assert.strictEqual(formatter(date), '1/1/2000');
	});

	it('Correctly formats the year 2000 in LA', () => {
		const formatter = dateFormatter('en-US', 'd', 'America/Los_Angeles');
		const date = new Date('2000-01-01T00:00:00.000Z'); // it's still 1999 in LA
		assert.strictEqual(formatter(date), '12/31/1999');
	});
});
