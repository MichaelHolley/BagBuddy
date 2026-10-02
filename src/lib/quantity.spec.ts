import { describe, expect, it } from 'vitest';
import { computeQuantity, formatRule } from './quantity';

const fixed = { baseQuantity: 1, perDay: null, max: null };
const tShirts = { baseQuantity: 1, perDay: 1, max: 7 };
const pants = { baseQuantity: 1, perDay: 0.3, max: 3 };
const snacks = { baseQuantity: 1, perDay: 2, max: null };

describe('computeQuantity', () => {
	it('uses the base quantity for fixed rules regardless of days', () => {
		expect(computeQuantity(fixed, 1)).toBe(1);
		expect(computeQuantity({ ...fixed, baseQuantity: 3 }, 30)).toBe(3);
	});

	it('scales per day and rounds up', () => {
		expect(computeQuantity(tShirts, 5)).toBe(5);
		expect(computeQuantity(pants, 5)).toBe(2);
		expect(computeQuantity(pants, 1)).toBe(1);
	});

	it('caps scaling rules at max', () => {
		expect(computeQuantity(tShirts, 10)).toBe(7);
		expect(computeQuantity(pants, 20)).toBe(3);
	});

	it('scales without limit when max is missing', () => {
		expect(computeQuantity(snacks, 14)).toBe(28);
	});

	it('prefers an override over the rule, including zero', () => {
		expect(computeQuantity(tShirts, 10, 4)).toBe(4);
		expect(computeQuantity(fixed, 3, 0)).toBe(0);
	});
});

describe('formatRule', () => {
	it('describes fixed and scaling rules', () => {
		expect(formatRule({ ...fixed, baseQuantity: 2 })).toBe('2');
		expect(formatRule(tShirts)).toBe('1/day ≤ 7');
		expect(formatRule(snacks)).toBe('2/day');
	});
});
