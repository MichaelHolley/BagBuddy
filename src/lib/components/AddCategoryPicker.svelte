<script lang="ts">
	import type { CatalogCategory } from '#lib/api/catalog.remote.js';
	import { addCategoryToTrip } from '#lib/api/trips.remote.js';
	import Icon from './Icon.svelte';

	let {
		tripId,
		categories,
		addedSourceIds
	}: {
		tripId: number;
		categories: CatalogCategory[];
		addedSourceIds: Set<number | null>;
	} = $props();

	let message = $state('');

	async function add(category: CatalogCategory) {
		const { added, skipped } = await addCategoryToTrip({ tripId, categoryId: category.id });
		message = added
			? `Added ${added} items from ${category.name}${skipped ? ` (${skipped} already on the list)` : ''}.`
			: `Everything from ${category.name} is already on the list.`;
	}
</script>

<div class="flex flex-wrap gap-2">
	{#each categories as category (category.id)}
		{@const complete =
			category.items.length > 0 && category.items.every((item) => addedSourceIds.has(item.id))}
		<button
			type="button"
			class={[
				'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition disabled:opacity-50',
				complete ? 'border-lime bg-lime text-ink' : 'border-line bg-white text-ink hover:border-ink'
			]}
			disabled={!!addCategoryToTrip.pending || category.items.length === 0}
			onclick={() => add(category)}
		>
			<Icon name={complete ? 'check' : 'plus'} class="size-4" />
			{category.name}
		</button>
	{/each}
</div>
{#if message}
	<p class="mt-2 text-sm text-muted" role="status">{message}</p>
{/if}
