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

<div
	class={[
		'flex items-center gap-1 py-1.5 transition-colors duration-300',
		item.packed && 'text-muted/70'
	]}
>
	<span class="relative grid size-5 shrink-0 place-items-center">
		<input
			type="checkbox"
			checked={item.packed}
			aria-label="Packed {item.name}"
			class="peer size-5 appearance-none rounded-md border-2 border-ink/40 transition-colors duration-150 checked:border-ink checked:bg-ink"
			onchange={(e) => onpatch({ packed: e.currentTarget.checked })}
		/>
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="3"
			stroke-linecap="round"
			stroke-linejoin="round"
			aria-hidden="true"
			class="pointer-events-none absolute size-3.5 text-paper transition-[stroke-dashoffset] duration-200 ease-out [stroke-dasharray:1_2] [stroke-dashoffset:1.5] peer-checked:delay-75 peer-checked:[stroke-dashoffset:0]"
		>
			<path d="M5 12l5 5L20 7" pathLength="1" />
		</svg>
	</span>
	<InlineEdit
		value={item.name}
		label="Name"
		class={[
			'flex-1 line-through transition-colors duration-300',
			item.packed ? 'decoration-current' : 'decoration-transparent'
		]}
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
</div>
