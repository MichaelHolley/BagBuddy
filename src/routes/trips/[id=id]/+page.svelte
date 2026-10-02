<script lang="ts">
	import { goto } from '$app/navigation';
	import { backOut } from 'svelte/easing';
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
	import { scale, slide } from '#lib/motion.js';

	let { params } = $props();

	const tripQuery = $derived(getTrip(params.id));
	const [trip, catalog] = $derived(await Promise.all([tripQuery, getCatalog()]));

	const groups = $derived(Map.groupBy(trip.items, (item) => item.categoryName));
	const packed = $derived(trip.items.filter((item) => item.packed).length);
	const allPacked = $derived(packed === trip.items.length);
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

<a href="/" class="-ml-1 inline-flex items-center text-sm text-muted hover:text-ink">
	<Icon name="back" class="size-4" /> Trips
</a>

<header class="mt-2 flex flex-col gap-3">
	<InlineEdit
		value={trip.name}
		label="Trip name"
		class="-mx-1.5 w-full heading"
		onsave={(name) => patchTrip({ name })}
	/>
	<div class="flex items-center justify-between gap-3">
		<div class="flex items-center gap-1 rounded-full border border-line bg-white pr-3">
			<Stepper
				value={trip.days}
				min={1}
				max={365}
				label="days"
				onchange={(days) => patchTrip({ days })}
			/>
			<span class="text-sm text-muted">{trip.days === 1 ? 'day' : 'days'}</span>
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
		<div transition:slide>
			<DuplicateTripForm {trip} oncancel={() => (duplicating = false)} />
		</div>
	{/if}
	<textarea
		value={trip.notes ?? ''}
		placeholder="Notes (optional)"
		aria-label="Notes"
		rows="2"
		class="w-full resize-y field text-sm"
		onchange={(e) => patchTrip({ notes: e.currentTarget.value })}></textarea>
	{#if trip.items.length}
		<div
			class={[
				'rounded-[20px] p-4 transition-colors duration-500',
				allPacked ? 'bg-lime' : 'bg-white'
			]}
		>
			{#if allPacked}
				<p
					class="mb-1.5 origin-left text-sm font-medium"
					in:scale={{ start: 0.8, easing: backOut }}
				>
					All packed! 🎉
				</p>
			{:else}
				<p class="mb-1.5 text-sm font-medium">Packing progress</p>
			{/if}
			<ProgressBar done={packed} total={trip.items.length} />
		</div>
	{/if}
</header>

<section class="mt-6">
	<h2 class="mb-3 text-xl font-medium tracking-[-0.02em]">Add categories</h2>
	<AddCategoryPicker tripId={trip.id} categories={catalog} {addedSourceIds} />
</section>

<div class="mt-8 flex flex-col gap-3">
	{#key trip.id}
		{#each groups as [name, items] (name)}
			<div transition:slide>
				<TripCategorySection
					{name}
					{items}
					days={trip.days}
					onpatch={patchItem}
					onremove={removeItem}
				/>
			</div>
		{:else}
			<p class="rounded-[20px] border border-dashed border-line p-6 text-center text-muted">
				Your list is empty. Add some categories above to get started.
			</p>
		{/each}
	{/key}
</div>

<section class="mt-8 mb-12">
	<h2 class="mb-3 text-xl font-medium tracking-[-0.02em]">Add a custom item</h2>
	<CustomItemForm tripId={trip.id} categories={catalog} />
</section>
