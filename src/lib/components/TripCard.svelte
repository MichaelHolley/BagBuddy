<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	let {
		trip
	}: { trip: { id: number; name: string; days: number; packed: number; total: number } } = $props();

	const complete = $derived(trip.total > 0 && trip.packed === trip.total);
</script>

<a
	href="/trips/{trip.id}"
	class={[
		'block rounded-[20px] p-5 transition hover:ring-1 hover:ring-ink',
		complete ? 'bg-lime' : 'bg-white'
	]}
>
	<div class="flex items-baseline justify-between gap-2">
		<h2 class="truncate text-lg font-medium tracking-[-0.02em]">{trip.name}</h2>
		<span class="shrink-0 text-sm text-muted">{trip.days} {trip.days === 1 ? 'day' : 'days'}</span>
	</div>
	<div class="mt-3">
		{#if trip.total}
			<ProgressBar done={trip.packed} total={trip.total} />
		{:else}
			<p class="text-sm text-muted/70">No items yet</p>
		{/if}
	</div>
</a>
