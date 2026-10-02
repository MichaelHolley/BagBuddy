<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	let {
		value,
		onsave,
		label,
		class: className,
		...rest
	}: {
		value: string;
		onsave: (value: string) => void;
		label: string;
	} & Omit<HTMLInputAttributes, 'value'> = $props();

	function commit(input: HTMLInputElement) {
		const next = input.value.trim();
		if (!next) input.value = value;
		else if (next !== value) onsave(next);
	}
</script>

<input
	{value}
	aria-label={label}
	class={[
		'min-w-0 rounded-md border border-transparent bg-transparent px-1.5 py-1 hover:border-stone-200 focus:border-teal-600 focus:bg-white focus:outline-none',
		className
	]}
	onblur={(e) => commit(e.currentTarget)}
	onkeydown={(e) => {
		if (e.key === 'Enter') e.currentTarget.blur();
		if (e.key === 'Escape') {
			e.currentTarget.value = value;
			e.currentTarget.blur();
		}
	}}
	{...rest}
/>
