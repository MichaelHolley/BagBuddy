<script lang="ts">
	import IconButton from './IconButton.svelte';
	import Stepper from './Stepper.svelte';

	let {
		name,
		quantity,
		overridden,
		auto,
		onchange,
		onreset
	}: {
		name: string;
		quantity: number;
		overridden: boolean;
		auto: string;
		onchange: (quantity: number) => void;
		onreset: () => void;
	} = $props();
</script>

<div
	class="flex items-center"
	title={overridden ? `Set manually (auto: ${auto})` : `Auto: ${auto}`}
>
	<Stepper
		value={quantity}
		label="quantity of {name}"
		{onchange}
		class={overridden ? 'text-amber-700' : ''}
	/>
	{#if overridden}
		<IconButton
			icon="reset"
			label="Reset {name} to auto ({auto})"
			class="size-8 text-amber-700"
			onclick={onreset}
		/>
	{:else}
		<span class="size-8" aria-hidden="true"></span>
	{/if}
</div>
