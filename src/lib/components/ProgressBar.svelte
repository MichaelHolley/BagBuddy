<script lang="ts">
	let { done, total, label = true }: { done: number; total: number; label?: boolean } = $props();

	const percent = $derived(total ? Math.round((done / total) * 100) : 0);
</script>

<div class="flex items-center gap-2">
	<div
		class="h-1.5 flex-1 overflow-hidden rounded-full bg-ink/10"
		role="progressbar"
		aria-valuemin={0}
		aria-valuemax={total}
		aria-valuenow={done}
	>
		<div
			class="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
			style:width="{percent}%"
		></div>
	</div>
	{#if label}
		<span class="shrink-0 text-xs font-medium tabular-nums">{done}/{total}</span>
	{/if}
</div>
