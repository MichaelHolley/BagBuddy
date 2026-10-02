<script lang="ts">
	import { goto } from '$app/navigation';
	import { getCatalog } from '#lib/api/catalog.remote.js';
	import {
		deleteTrip,
		getTrip,
		removeTripItem,
		updateTrip,
		updateTripItem,
		type Trip,
		type TripItem
	} from '#lib/api/trips.remote.js';
	import AddCategoryPicker from '#lib/components/AddCategoryPicker.svelte';
	import CustomItemForm from '#lib/components/CustomItemForm.svelte';
	import DuplicateTripForm from '#lib/components/DuplicateTripForm.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import InlineEdit from '#lib/components/InlineEdit.svelte';
	import ProgressBar from '#lib/components/ProgressBar.svelte';
	import Stepper from '#lib/components/Stepper.svelte';
	import TripCategorySection from '#lib/components/TripCategorySection.svelte';
	import type { TripItemPatch } from '#lib/components/TripItemRow.svelte';

	let { params } = $props();

	const tripQuery = $derived(getTrip(params.id));
	const [trip, catalog] = $derived(await Promise.all([tripQuery, getCatalog()]));

	const groups = $derived(Map.groupBy(trip.items, (item) => item.categoryName));
	const packed = $derived(trip.items.filter((item) => item.packed).length);
	const addedSourceIds = $derived(new Set(trip.items.map((item) => item.sourceCatalogItemId)));

	let duplicating = $state(false);

	function optimistic(update: (trip: Trip) => Trip) {
		return tripQuery.withOverride(update);
	}

	function patchItem(item: TripItem, patch: TripItemPatch) {
		void updateTripItem({ id: item.id, ...patch }).updates(
			optimistic((t) => ({
				...t,
				items: t.items.map((i) => (i.id === item.id ? { ...i, ...patch } : i))
			}))
		);
	}

	function removeItem(item: TripItem) {
		void removeTripItem(item.id).updates(
			optimistic((t) => ({ ...t, items: t.items.filter((i) => i.id !== item.id) }))
		);
	}

	function patchTrip(patch: Partial<Pick<Trip, 'name' | 'days'>> & { notes?: string }) {
		void updateTrip({ id: trip.id, ...patch }).updates(
			optimistic((t) => ({ ...t, ...patch, notes: patch.notes ?? t.notes }))
		);
	}

	async function remove() {
		if (!confirm(`Delete "${trip.name}"? This cannot be undone.`)) return;
		await deleteTrip(trip.id);
		await goto('/');
	}
</script>

<svelte:head><title>{trip.name} · BagBuddy</title></svelte:head>

<a href="/" class="-ml-1 inline-flex items-center text-sm text-stone-500 hover:text-stone-900">
	<Icon name="back" class="size-4" /> Trips
</a>

<header class="mt-2 flex flex-col gap-3">
	<InlineEdit
		value={trip.name}
		label="Trip name"
		class="-mx-1.5 w-full text-2xl font-bold"
		onsave={(name) => patchTrip({ name })}
	/>
	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-1 rounded-full border border-stone-200 bg-white pr-3">
			<Stepper
				value={trip.days}
				min={1}
				max={365}
				label="days"
				onchange={(days) => patchTrip({ days })}
			/>
			<span class="text-sm text-stone-500">{trip.days === 1 ? 'day' : 'days'}</span>
		</div>
		<div class="flex gap-2">
			<button class="btn-secondary px-3" onclick={() => (duplicating = !duplicating)}>
				<Icon name="copy" class="size-4" /> Duplicate
			</button>
			<button
				class="btn-secondary px-3 text-red-700 hover:bg-red-50"
				aria-label="Delete trip"
				title="Delete trip"
				onclick={remove}
			>
				<Icon name="trash" class="size-4" />
			</button>
		</div>
	</div>
	{#if duplicating}
		<DuplicateTripForm {trip} oncancel={() => (duplicating = false)} />
	{/if}
	<textarea
		value={trip.notes ?? ''}
		placeholder="Notes (optional)"
		aria-label="Notes"
		rows="2"
		class="w-full resize-y field text-sm"
		onchange={(e) => patchTrip({ notes: e.currentTarget.value })}></textarea>
	{#if trip.items.length}
		<div class="rounded-xl bg-white p-3 shadow-sm">
			<p class="mb-1.5 text-sm font-medium text-stone-600">
				{packed === trip.items.length ? 'All packed! 🎉' : 'Packing progress'}
			</p>
			<ProgressBar done={packed} total={trip.items.length} />
		</div>
	{/if}
</header>

<div class="mt-6 flex flex-col gap-3">
	{#each groups as [name, items] (name)}
		<TripCategorySection
			{name}
			{items}
			days={trip.days}
			onpatch={patchItem}
			onremove={removeItem}
		/>
	{:else}
		<p class="rounded-xl border border-dashed border-stone-300 p-6 text-center text-stone-500">
			Your list is empty. Add some categories below to get started.
		</p>
	{/each}
</div>

<section class="mt-8">
	<h2 class="mb-3 font-semibold">Add categories</h2>
	<AddCategoryPicker tripId={trip.id} categories={catalog} {addedSourceIds} />
</section>

<section class="mt-8 mb-12">
	<h2 class="mb-3 font-semibold">Add a custom item</h2>
	<CustomItemForm tripId={trip.id} categories={catalog} />
</section>
