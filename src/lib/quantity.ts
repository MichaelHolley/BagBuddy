export type QuantityRule = {
	baseQuantity: number;
	perDay: number | null;
	max: number | null;
};

export function computeQuantity(
	{ baseQuantity, perDay, max }: QuantityRule,
	days: number,
	override: number | null = null
): number {
	if (override !== null) return override;
	if (!perDay) return baseQuantity;
	return Math.min(Math.ceil(perDay * days), max ?? Infinity);
}

export function formatRule({ baseQuantity, perDay, max }: QuantityRule): string {
	if (!perDay) return `${baseQuantity}`;
	return max === null ? `${perDay}/day` : `${perDay}/day ≤ ${max}`;
}
