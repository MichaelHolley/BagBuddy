<script lang="ts">
	import type { TripItem } from '#lib/api/trips.remote.js';
	import { computeQuantity, formatRule } from '#lib/quantity.js';
	import IconButton from './IconButton.svelte';
	import InlineEdit from './InlineEdit.svelte';
	import QuantityControl from './QuantityControl.svelte';

	export type TripItemPatch = Partial<Pick<TripItem, 'name' | 'quantityOverride' | 'packed'>>;

	let {
		item,
		days,
		onpatch,
		onremove
	}: {
		item: TripItem;
		days: number;
		onpatch: (patch: TripItemPatch) => void;
		onremove: () => void;
	} = $props();

	const auto = $derived(computeQuantity(item, days));
	const quantity = $derived(computeQuantity(item, days, item.quantityOverride));
</script>

<li class={['flex items-center gap-1 py-1.5', item.packed && 'text-muted/70']}>
	<input
		type="checkbox"
		checked={item.packed}
		aria-label="Packed {item.name}"
		class="size-5 shrink-0 accent-ink"
		onchange={(e) => onpatch({ packed: e.currentTarget.checked })}
	/>
	<InlineEdit
		value={item.name}
		label="Name"
		class={['flex-1', item.packed && 'line-through']}
		onsave={(name) => onpatch({ name })}
	/>
	<QuantityControl
		name={item.name}
		{quantity}
		overridden={item.quantityOverride !== null}
		auto={item.perDay ? `${auto} (${formatRule(item)})` : `${auto}`}
		onchange={(quantityOverride) => onpatch({ quantityOverride })}
		onreset={() => onpatch({ quantityOverride: null })}
	/>
	<IconButton icon="close" label="Remove {item.name}" class="size-8" onclick={onremove} />
</li>
