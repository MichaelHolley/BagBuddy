<script lang="ts">
	import { createCategory, getCatalog } from '#lib/api/catalog.remote.js';
	import CatalogCategory from '#lib/components/CatalogCategory.svelte';
	import FieldIssues from '#lib/components/FieldIssues.svelte';
</script>

<svelte:head><title>Catalog · BagBuddy</title></svelte:head>

<h1 class="heading">Catalog</h1>
<p class="mt-1 text-sm text-muted">
	Reusable categories you can add to trips. Changes here never touch existing trips.
</p>

<form
	{...createCategory.enhance(async ({ submit, element }) => {
		if (await submit()) element.reset();
	})}
	class="mt-4 flex gap-2"
>
	<input
		{...createCategory.fields.name.as('text')}
		placeholder="New category"
		aria-label="New category name"
		class="min-w-0 flex-1 field"
	/>
	<button class="btn" disabled={!!createCategory.pending}>Add</button>
</form>
<FieldIssues issues={createCategory.fields.name.issues()} />

<div class="mt-6 flex flex-col gap-3">
	{#each await getCatalog() as category (category.id)}
		<CatalogCategory {category} />
	{:else}
		<p class="text-center text-muted">No categories yet.</p>
	{/each}
</div>
