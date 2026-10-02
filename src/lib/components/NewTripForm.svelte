<script lang="ts">
	import { createTrip } from '#lib/api/trips.remote.js';
	import FieldIssues from './FieldIssues.svelte';

	const { fields } = createTrip;
</script>

<form {...createTrip} class="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
	<h2 class="font-semibold">New trip</h2>
	<div class="mt-3 flex gap-2">
		<label class="min-w-0 flex-1">
			<span class="sr-only">Trip name</span>
			<input
				{...fields.name.as('text')}
				placeholder="e.g. Lake Garda camping"
				class="w-full field"
			/>
		</label>
		<label class="flex items-center gap-1.5">
			<input {...fields.days.as('number', 7)} min="1" max="365" class="w-16 field" />
			<span class="text-sm text-stone-500">days</span>
		</label>
	</div>
	<FieldIssues issues={fields.name.issues()} />
	<FieldIssues issues={fields.days.issues()} />
	<button class="mt-3 btn w-full sm:w-auto" disabled={!!createTrip.pending}>Create trip</button>
</form>
