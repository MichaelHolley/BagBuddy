import * as v from 'valibot';

export const id = v.pipe(v.number(), v.integer(), v.minValue(1));
export const idFromSelect = v.pipe(v.string(), v.toNumber(), id);
export const name = v.pipe(
	v.string(),
	v.trim(),
	v.nonEmpty('Please enter a name'),
	v.maxLength(100)
);
export const quantity = v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(999));
export const days = v.pipe(
	v.number('Please enter the number of days'),
	v.integer(),
	v.minValue(1, 'A trip lasts at least one day'),
	v.maxValue(365)
);

export const quantityModes = ['fixed', 'daily'] as const;
export type QuantityMode = (typeof quantityModes)[number];

export const quantityRuleFields = {
	mode: v.picklist(quantityModes),
	baseQuantity: v.optional(quantity, 1),
	perDay: v.optional(v.pipe(v.number(), v.gtValue(0, 'Must be more than 0'), v.maxValue(100))),
	max: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1, 'Must be at least 1')))
};

export const catalogItemFields = { name, ...quantityRuleFields };
