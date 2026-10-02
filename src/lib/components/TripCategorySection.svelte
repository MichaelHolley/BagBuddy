<script lang="ts">
	import type { TripItem } from '#lib/api/trips.remote.js';
	import ProgressBar from './ProgressBar.svelte';
	import TripItemRow, { type TripItemPatch } from './TripItemRow.svelte';

	let {
		name,
		items,
		days,
		onpatch,
		onremove
	}: {
		name: string;
		items: TripItem[];
		days: number;
		onpatch: (item: TripItem, patch: TripItemPatch) => void;
		onremove: (item: TripItem) => void;
	} = $props();

	const packed = $derived(items.filter((item) => item.packed).length);
</script>

<section class="rounded-[20px] bg-white px-3 py-4">
	<header class="mb-1 flex items-center gap-3 px-1">
		<h2 class="font-medium">{name}</h2>
		<div class="ml-auto w-28"><ProgressBar done={packed} total={items.length} /></div>
	</header>
	<ul class="divide-y divide-wash">
		{#each items as item (item.id)}
			<TripItemRow
				{item}
				{days}
				onpatch={(patch) => onpatch(item, patch)}
				onremove={() => onremove(item)}
			/>
		{/each}
	</ul>
</section>
