<script lang="ts">
	let { done, total, label = true }: { done: number; total: number; label?: boolean } = $props();

	const percent = $derived(total ? Math.round((done / total) * 100) : 0);
</script>

<div class="flex items-center gap-2">
	<div
		class="h-2 flex-1 overflow-hidden rounded-full bg-stone-200"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={total}
		aria-valuenow={done}
	>
		<div
			class={[
				'h-full rounded-full transition-all',
				percent === 100 ? 'bg-emerald-500' : 'bg-teal-600'
			]}
			style:width="{percent}%"
		></div>
	</div>
	{#if label}
		<span class="shrink-0 text-xs text-stone-500 tabular-nums">{done}/{total}</span>
	{/if}
</div>
