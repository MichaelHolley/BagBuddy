<script lang="ts">
	import { getTrips } from '#lib/api/trips.remote.js';
	import NewTripForm from '#lib/components/NewTripForm.svelte';
	import TripCard from '#lib/components/TripCard.svelte';
</script>

<svelte:head><title>Trips · BagBuddy</title></svelte:head>

<h1 class="heading">Your trips</h1>

<div class="mt-4 flex flex-col gap-3">
	<NewTripForm />

	{#each await getTrips() as trip (trip.id)}
		<TripCard {trip} />
	{:else}
		<p class="py-6 text-center text-muted">No trips yet — create your first one above.</p>
	{/each}
</div>
