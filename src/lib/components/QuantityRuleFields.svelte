<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import type { QuantityRule } from '#lib/quantity.js';
	import type { QuantityMode } from '#lib/schemas.js';
	import FieldIssues from './FieldIssues.svelte';

	let {
		fields,
		rule = { baseQuantity: 1, perDay: null, max: null }
	}: {
		fields: {
			mode: RemoteFormField<QuantityMode>;
			baseQuantity: RemoteFormField<number>;
			perDay: RemoteFormField<number>;
			max: RemoteFormField<number>;
		};
		rule?: QuantityRule;
	} = $props();

	const initialMode: QuantityMode = $derived(rule.perDay ? 'daily' : 'fixed');
	const mode = $derived(fields.mode.value() ?? initialMode);
</script>

<div class="flex flex-wrap items-center gap-2 text-sm">
	<select {...fields.mode.as('select', initialMode)} aria-label="Quantity rule" class="field">
		<option value="fixed">Fixed</option>
		<option value="daily">Per day</option>
	</select>

	{#if mode === 'fixed'}
		<input
			{...fields.baseQuantity.as('number', rule.baseQuantity)}
			aria-label="Quantity"
			min="0"
			class="w-16 field"
		/>
	{:else}
		<label class="flex items-center gap-1">
			<input
				{...fields.perDay.as('number', rule.perDay ?? 1)}
				min="0.01"
				step="0.01"
				class="w-16 field"
			/>
			<span class="text-stone-500">/day</span>
		</label>
		<label class="flex items-center gap-1">
			<span class="text-stone-500">max</span>
			<input
				{...fields.max.as('number', rule.max ?? undefined)}
				min="1"
				placeholder="∞"
				class="w-16 field"
			/>
		</label>
	{/if}
	<FieldIssues issues={fields.baseQuantity.issues()} />
	<FieldIssues issues={fields.perDay.issues()} />
	<FieldIssues issues={fields.max.issues()} />
</div>
