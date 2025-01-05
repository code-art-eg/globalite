import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { numberFormatter } from '../src/number-formatter';

describe('Number formatting', () => {
	it('Correctly formats in en-US locale using default specifier', () => {
		const formatter = numberFormatter('en-US');
		assert.strictEqual(formatter(1234567.89), '1,234,567.89');
	});
});
