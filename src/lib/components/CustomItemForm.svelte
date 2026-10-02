<script lang="ts">
	import type { CatalogCategory } from '#lib/api/catalog.remote.js';
	import { addCustomItem } from '#lib/api/trips.remote.js';
	import FieldIssues from './FieldIssues.svelte';

	let { tripId, categories }: { tripId: number; categories: CatalogCategory[] } = $props();

	const { fields } = addCustomItem;
</script>

<form
	{...addCustomItem.enhance(async ({ submit, element }) => {
		if (await submit()) element.reset();
	})}
	class="flex flex-col gap-2"
>
	<input {...fields.tripId.as('hidden', tripId)} />
	<div class="flex gap-2">
		<input
			{...fields.name.as('text')}
			placeholder="Item name"
			aria-label="Item name"
			class="min-w-0 flex-1 field"
		/>
		<input
			{...fields.baseQuantity.as('number', 1)}
			min="0"
			aria-label="Quantity"
			class="w-16 field"
		/>
	</div>
	<FieldIssues issues={fields.name.issues()} />
	<div class="flex gap-2">
		<select
			{...fields.categoryId.as('select', String(categories[0]?.id ?? ''))}
			aria-label="Category"
			class="min-w-0 flex-1 field"
		>
			{#each categories as category (category.id)}
				<option value={category.id}>{category.name}</option>
			{/each}
		</select>
		<button class="btn" disabled={!!addCustomItem.pending}>Add</button>
	</div>
</form>
