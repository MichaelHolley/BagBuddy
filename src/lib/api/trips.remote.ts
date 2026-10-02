import { error, redirect } from '@sveltejs/kit';
import { asc, count, desc, eq, sql } from 'drizzle-orm';
import * as v from 'valibot';
import { command, form, query } from '$app/server';
import { db } from '#lib/server/db/index.js';
import { catalogItem, category, trip, tripItem } from '#lib/server/db/schema.js';
import { days, id, idFromSelect, name, quantity } from '#lib/schemas.js';

export const getTrips = query(async () => {
	return db
		.select({
			id: trip.id,
			name: trip.name,
			days: trip.days,
			total: count(tripItem.id),
			packed: sql<number>`coalesce(sum(${tripItem.packed}), 0)`.mapWith(Number)
		})
		.from(trip)
		.leftJoin(tripItem, eq(tripItem.tripId, trip.id))
		.groupBy(trip.id)
		.orderBy(desc(trip.createdAt), desc(trip.id));
});

export const getTrip = query(id, async (tripId) => {
	const [found] = await db.select().from(trip).where(eq(trip.id, tripId));
	if (!found) error(404, 'Trip not found');

	const items = await db
		.select()
		.from(tripItem)
		.where(eq(tripItem.tripId, tripId))
		.orderBy(asc(tripItem.categorySortOrder), asc(tripItem.categoryName), asc(tripItem.id));

	return { ...found, items };
});

export type Trip = Awaited<ReturnType<typeof getTrip>>;
export type TripItem = Trip['items'][number];

export const createTrip = form(v.object({ name, days }), async (data) => {
	const [created] = await db.insert(trip).values(data).returning({ id: trip.id });
	redirect(303, `/trips/${created.id}`);
});

export const updateTrip = command(
	v.object({
		id,
		name: v.optional(name),
		days: v.optional(days),
		notes: v.optional(v.pipe(v.string(), v.trim(), v.maxLength(2000)))
	}),
	async ({ id: tripId, ...patch }) => {
		await db
			.update(trip)
			.set({ ...patch, notes: patch.notes === '' ? null : patch.notes })
			.where(eq(trip.id, tripId));
		await getTrip(tripId).refresh();
	}
);

export const deleteTrip = command(id, async (tripId) => {
	await db.delete(trip).where(eq(trip.id, tripId));
});

export const duplicateTrip = form(v.object({ id, name }), async (data) => {
	const source = await getTrip(data.id);

	const newId = await db.transaction(async (tx) => {
		const [created] = await tx
			.insert(trip)
			.values({ name: data.name, days: source.days, notes: source.notes })
			.returning({ id: trip.id });

		if (source.items.length) {
			await tx.insert(tripItem).values(
				source.items.map((item) => ({
					...item,
					id: undefined,
					tripId: created.id,
					packed: false
				}))
			);
		}
		return created.id;
	});

	redirect(303, `/trips/${newId}`);
});

export const addCategoryToTrip = command(
	v.object({ tripId: id, categoryId: id }),
	async ({ tripId, categoryId }) => {
		const [source] = await db.select().from(category).where(eq(category.id, categoryId));
		if (!source) error(404, 'Category not found');

		const [items, existing] = await Promise.all([
			db.select().from(catalogItem).where(eq(catalogItem.categoryId, categoryId)),
			db
				.select({ sourceId: tripItem.sourceCatalogItemId })
				.from(tripItem)
				.where(eq(tripItem.tripId, tripId))
		]);
		const existingIds = new Set(existing.map((row) => row.sourceId));
		const missing = items.filter((item) => !existingIds.has(item.id));

		if (missing.length) {
			await db.insert(tripItem).values(
				missing.map((item) => ({
					tripId,
					categoryName: source.name,
					categorySortOrder: source.sortOrder,
					name: item.name,
					baseQuantity: item.baseQuantity,
					perDay: item.perDay,
					max: item.max,
					sourceCatalogItemId: item.id
				}))
			);
		}
		await getTrip(tripId).refresh();
		return { added: missing.length, skipped: items.length - missing.length };
	}
);

export const addCustomItem = form(
	v.object({ tripId: id, categoryId: idFromSelect, name, baseQuantity: quantity }),
	async ({ tripId, categoryId, ...item }) => {
		const [target] = await db.select().from(category).where(eq(category.id, categoryId));
		if (!target) error(404, 'Category not found');

		await db.insert(tripItem).values({
			...item,
			tripId,
			categoryName: target.name,
			categorySortOrder: target.sortOrder
		});
		await getTrip(tripId).refresh();
	}
);

export const updateTripItem = command(
	v.object({
		id,
		name: v.optional(name),
		quantityOverride: v.optional(v.nullable(quantity)),
		packed: v.optional(v.boolean())
	}),
	async ({ id: itemId, ...patch }) => {
		const [updated] = await db
			.update(tripItem)
			.set(patch)
			.where(eq(tripItem.id, itemId))
			.returning({ tripId: tripItem.tripId });
		if (!updated) error(404, 'Item not found');
		await getTrip(updated.tripId).refresh();
	}
);

export const removeTripItem = command(id, async (itemId) => {
	const [removed] = await db
		.delete(tripItem)
		.where(eq(tripItem.id, itemId))
		.returning({ tripId: tripItem.tripId });
	if (removed) await getTrip(removed.tripId).refresh();
});
