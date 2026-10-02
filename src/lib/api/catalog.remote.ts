import { invalid } from '@sveltejs/kit';
import { asc, eq, max } from 'drizzle-orm';
import * as v from 'valibot';
import { command, form, query } from '$app/server';
import { db } from '#lib/server/db/index.js';
import { catalogItem, category } from '#lib/server/db/schema.js';
import { catalogItemFields, id, name, type QuantityMode } from '#lib/schemas.js';
import type { QuantityRule } from '#lib/quantity.js';

export const getCatalog = query(async () => {
	const [categories, items] = await Promise.all([
		db.select().from(category).orderBy(asc(category.sortOrder), asc(category.id)),
		db.select().from(catalogItem).orderBy(asc(catalogItem.id))
	]);

	return categories.map((c) => ({
		...c,
		items: items.filter((item) => item.categoryId === c.id)
	}));
});

export type CatalogCategory = Awaited<ReturnType<typeof getCatalog>>[number];

export const createCategory = form(v.object({ name }), async (data) => {
	const [{ last }] = await db.select({ last: max(category.sortOrder) }).from(category);
	await db.insert(category).values({ name: data.name, sortOrder: (last ?? -1) + 1 });
	await getCatalog().refresh();
});

export const renameCategory = form(v.object({ id, name }), async (data) => {
	await db.update(category).set({ name: data.name }).where(eq(category.id, data.id));
	await getCatalog().refresh();
});

export const deleteCategory = command(id, async (categoryId) => {
	await db.delete(category).where(eq(category.id, categoryId));
	await getCatalog().refresh();
});

type RuleInput = {
	mode: QuantityMode;
	baseQuantity: number;
	perDay?: number;
	max?: number;
};

function toRule(input: RuleInput, onMissingPerDay: () => never): QuantityRule {
	if (input.mode === 'fixed') return { baseQuantity: input.baseQuantity, perDay: null, max: null };
	if (input.perDay === undefined) onMissingPerDay();
	return { baseQuantity: 1, perDay: input.perDay, max: input.max ?? null };
}

export const createCatalogItem = form(
	v.object({ categoryId: id, ...catalogItemFields }),
	async (data, issue) => {
		const rule = toRule(data, () => invalid(issue.perDay('Please enter an amount per day')));
		await db.insert(catalogItem).values({ categoryId: data.categoryId, name: data.name, ...rule });
		await getCatalog().refresh();
	}
);

export const updateCatalogItem = form(
	v.object({ id, ...catalogItemFields }),
	async (data, issue) => {
		const rule = toRule(data, () => invalid(issue.perDay('Please enter an amount per day')));
		await db
			.update(catalogItem)
			.set({ name: data.name, ...rule })
			.where(eq(catalogItem.id, data.id));
		await getCatalog().refresh();
	}
);

export const deleteCatalogItem = command(id, async (itemId) => {
	await db.delete(catalogItem).where(eq(catalogItem.id, itemId));
	await getCatalog().refresh();
});
