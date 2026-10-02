<script lang="ts">
	import { duplicateTrip } from '#lib/api/trips.remote.js';
	import FieldIssues from './FieldIssues.svelte';

	let { trip, oncancel }: { trip: { id: number; name: string }; oncancel: () => void } = $props();

	const { fields } = duplicateTrip;
</script>

<form {...duplicateTrip} class="rounded-xl border border-teal-200 bg-teal-50 p-4">
	<input {...fields.id.as('hidden', trip.id)} />
	<label class="block text-sm font-medium text-teal-900" for="duplicate-name">
		Name for the copy (packed items are reset)
	</label>
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{...fields.name.as('text', `${trip.name} (copy)`)}
		id="duplicate-name"
		class="mt-2 w-full field"
		autofocus
	/>
	<FieldIssues issues={fields.name.issues()} />
	<div class="mt-3 flex justify-end gap-2">
		<button type="button" class="btn-secondary" onclick={oncancel}>Cancel</button>
		<button class="btn" disabled={!!duplicateTrip.pending}>Duplicate</button>
	</div>
</form>
