<script lang="ts">
	import IconButton from './IconButton.svelte';

	let {
		value,
		min = 0,
		max = 999,
		label,
		onchange,
		class: className = ''
	}: {
		value: number;
		min?: number;
		max?: number;
		label: string;
		onchange: (value: number) => void;
		class?: string;
	} = $props();
</script>

<div class="flex items-center" role="group" aria-label={label}>
	<IconButton
		icon="minus"
		label="Decrease {label}"
		class="size-8"
		disabled={value <= min}
		onclick={() => onchange(value - 1)}
	/>
	<span class={['min-w-7 text-center font-medium tabular-nums', className]}>{value}</span>
	<IconButton
		icon="plus"
		label="Increase {label}"
		class="size-8"
		disabled={value >= max}
		onclick={() => onchange(value + 1)}
	/>
</div>
