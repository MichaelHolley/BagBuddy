import { sql } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

const quantityRule = {
	baseQuantity: integer('base_quantity').notNull().default(1),
	perDay: real('per_day'),
	max: integer('max')
};

export const category = sqliteTable('category', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	sortOrder: integer('sort_order').notNull().default(0)
});

export const catalogItem = sqliteTable('catalog_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	categoryId: integer('category_id')
		.notNull()
		.references(() => category.id, { onDelete: 'cascade' }),
	name: text('name').notNull(),
	...quantityRule
});

export const trip = sqliteTable('trip', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	days: integer('days').notNull(),
	notes: text('notes'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`)
});

export const tripItem = sqliteTable('trip_item', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	tripId: integer('trip_id')
		.notNull()
		.references(() => trip.id, { onDelete: 'cascade' }),
	categoryName: text('category_name').notNull(),
	categorySortOrder: integer('category_sort_order').notNull().default(0),
	name: text('name').notNull(),
	...quantityRule,
	quantityOverride: integer('quantity_override'),
	packed: integer('packed', { mode: 'boolean' }).notNull().default(false),
	sourceCatalogItemId: integer('source_catalog_item_id')
});
