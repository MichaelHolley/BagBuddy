<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import Icon, { type IconName } from './Icon.svelte';

	let {
		icon,
		label,
		variant = 'ghost',
		class: className = '',
		...rest
	}: {
		icon: IconName;
		label: string;
		variant?: 'ghost' | 'primary';
	} & HTMLButtonAttributes = $props();
</script>

<button
	type="button"
	title={label}
	aria-label={label}
	class={[
		'grid size-9 shrink-0 place-items-center rounded-full transition disabled:opacity-40',
		variant === 'primary'
			? 'bg-teal-700 text-white hover:bg-teal-800'
			: 'text-stone-500 hover:bg-stone-100 hover:text-stone-900',
		className
	]}
	{...rest}
>
	<Icon name={icon} />
</button>
