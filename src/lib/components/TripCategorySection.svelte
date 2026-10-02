<script lang="ts">
	import type { TripItem } from '#lib/api/trips.remote.js';
	import { slide } from '#lib/motion.js';
	import Icon from './Icon.svelte';
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

	let collapsed = $state(false);
</script>

<section class="rounded-[20px] bg-white px-3 py-4">
	<h2 class="px-1">
		<button
			type="button"
			class="flex w-full items-center gap-3 text-left"
			aria-expanded={!collapsed}
			onclick={() => (collapsed = !collapsed)}
		>
			<Icon
				name="chevron"
				class={['size-4 shrink-0 transition-transform', collapsed && '-rotate-90']}
			/>
			<span class="font-medium">{name}</span>
			<span class="ml-auto w-28"><ProgressBar done={packed} total={items.length} /></span>
		</button>
	</h2>
	{#if !collapsed}
		<ul class="divide-y divide-wash pt-1" transition:slide>
			{#each items as item (item.id)}
				<li transition:slide>
					<TripItemRow
						{item}
						{days}
						onpatch={(patch) => onpatch(item, patch)}
						onremove={() => onremove(item)}
					/>
				</li>
			{/each}
		</ul>
	{/if}
</section>
