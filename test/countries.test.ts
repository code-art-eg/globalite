import { COUNTRY_CODES, getCountries } from '@code-art-eg/globalite';
import type { Country } from '@code-art-eg/globalite';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

describe('getCountries', () => {
	it('should return an array of countries', () => {
		const res = getCountries('en');
		assert.strictEqual(res.length, COUNTRY_CODES.length);
	});

	it('should return an array of countries in German', () => {
		const res = getCountries('de');
		const rx = /^[A-Z]{2}$/;
		for (const country of res) {
			assert.strictEqual(typeof country.code, 'string');
			assert.strictEqual(rx.test(country.code), true);
			assert.strictEqual(typeof country.name, 'string');
			assert.strictEqual(country.name.length > 2, true);
		}
	});

	it('should return an array of sorted in English', () => {
		const res = getCountries('en');
		const collator = new Intl.Collator('en');
		let last: Country | undefined;
		for (const country of res) {
			if (last) {
				assert.strictEqual(
					collator.compare(last.name, country.name) < 0,
					true,
					`${last.code}:${last.name} < ${country.code}: ${country.name}`
				);
			}
			last = country;
		}
	});
});
