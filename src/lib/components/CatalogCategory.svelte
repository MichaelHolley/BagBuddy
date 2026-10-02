<script lang="ts">
	import {
		createCatalogItem,
		deleteCategory,
		renameCategory,
		type CatalogCategory
	} from '#lib/api/catalog.remote.js';
	import CatalogItemRow from './CatalogItemRow.svelte';
	import FieldIssues from './FieldIssues.svelte';
	import IconButton from './IconButton.svelte';
	import QuantityRuleFields from './QuantityRuleFields.svelte';

	let { category }: { category: CatalogCategory } = $props();

	const rename = $derived(renameCategory.for(category.id));
	const create = $derived(createCatalogItem.for(category.id));

	function remove() {
		const message = `Delete "${category.name}" and its ${category.items.length} items? Existing trips stay unchanged.`;
		if (confirm(message)) deleteCategory(category.id);
	}
</script>

<details class="group rounded-[20px] bg-white">
	<summary
		class="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 select-none"
	>
		<span class="font-medium">{category.name}</span>
		<span class="text-sm text-muted">{category.items.length} items</span>
	</summary>

	<div class="border-t border-wash px-4 pb-4">
		<form {...rename} class="flex items-center gap-2 pt-3">
			<input {...rename.fields.id.as('hidden', category.id)} />
			<input
				{...rename.fields.name.as('text', category.name)}
				aria-label="Category name"
				class="min-w-0 flex-1 field font-medium"
			/>
			<IconButton type="submit" icon="check" label="Rename category" disabled={!!rename.pending} />
			<IconButton icon="trash" label="Delete category" onclick={remove} />
		</form>
		<FieldIssues issues={rename.fields.name.issues()} />

		<div class="divide-y divide-wash">
			{#each category.items as item (item.id)}
				<CatalogItemRow {item} />
			{/each}
		</div>

		<form
			{...create.enhance(async ({ submit, element }) => {
				if (await submit()) element.reset();
			})}
			class="mt-2 flex flex-col gap-2 rounded-lg bg-paper p-3 sm:flex-row sm:items-start"
		>
			<input {...create.fields.categoryId.as('hidden', category.id)} />
			<div class="flex-1">
				<input
					{...create.fields.name.as('text')}
					placeholder="New item"
					aria-label="New item name"
					class="w-full field"
				/>
				<FieldIssues issues={create.fields.name.issues()} />
			</div>
			<div class="flex items-start justify-between gap-2">
				<QuantityRuleFields fields={create.fields} />
				<IconButton
					type="submit"
					icon="plus"
					label="Add item"
					variant="primary"
					disabled={!!create.pending}
				/>
			</div>
		</form>
	</div>
</details>
