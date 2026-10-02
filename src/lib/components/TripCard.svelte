<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	let {
		trip
	}: { trip: { id: number; name: string; days: number; packed: number; total: number } } = $props();
</script>

<a
	href="/trips/{trip.id}"
	class="block rounded-xl border border-stone-200 bg-white p-4 shadow-sm transition hover:border-teal-600"
>
	<div class="flex items-baseline justify-between gap-2">
		<h2 class="truncate font-semibold">{trip.name}</h2>
		<span class="shrink-0 text-sm text-stone-500"
			>{trip.days} {trip.days === 1 ? 'day' : 'days'}</span
		>
	</div>
	<div class="mt-3">
		{#if trip.total}
			<ProgressBar done={trip.packed} total={trip.total} />
		{:else}
			<p class="text-sm text-stone-400">No items yet</p>
		{/if}
	</div>
</a>
