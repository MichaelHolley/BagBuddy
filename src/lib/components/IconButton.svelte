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
		'grid size-9 shrink-0 place-items-center rounded-full transition enabled:active:scale-[0.97] disabled:opacity-40',
		variant === 'primary'
			? 'bg-ink text-paper hover:bg-ink/85'
			: 'text-muted hover:bg-ink/5 hover:text-ink',
		className
	]}
	{...rest}
>
	<Icon name={icon} />
</button>
