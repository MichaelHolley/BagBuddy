<script lang="ts">
	import { deleteCatalogItem, updateCatalogItem } from '#lib/api/catalog.remote.js';
	import type { QuantityRule } from '#lib/quantity.js';
	import FieldIssues from './FieldIssues.svelte';
	import IconButton from './IconButton.svelte';
	import QuantityRuleFields from './QuantityRuleFields.svelte';

	let { item }: { item: QuantityRule & { id: number; name: string } } = $props();

	const edit = $derived(updateCatalogItem.for(item.id));
</script>

<form {...edit} class="flex flex-col gap-2 py-3 sm:flex-row sm:items-start">
	<input {...edit.fields.id.as('hidden', item.id)} />
	<div class="flex-1">
		<input
			{...edit.fields.name.as('text', item.name)}
			aria-label="Item name"
			class="w-full field"
		/>
		<FieldIssues issues={edit.fields.name.issues()} />
	</div>
	<div class="flex items-start justify-between gap-2">
		<QuantityRuleFields fields={edit.fields} rule={item} />
		<div class="flex">
			<IconButton
				type="submit"
				icon="check"
				label="Save {item.name}"
				class={edit.fields.dirty() ? 'text-teal-700' : ''}
				disabled={!!edit.pending}
			/>
			<IconButton
				icon="trash"
				label="Delete {item.name}"
				onclick={() => deleteCatalogItem(item.id)}
			/>
		</div>
	</div>
</form>
