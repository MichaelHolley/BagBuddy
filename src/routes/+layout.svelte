<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children } = $props();

	const links = [
		{ href: '/', label: 'Trips' },
		{ href: '/catalog', label: 'Catalog' }
	];
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="min-h-dvh bg-stone-100 text-stone-900">
	<header class="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
		<nav class="mx-auto flex max-w-2xl items-center gap-1 px-4 py-2">
			<a href="/" class="mr-auto text-lg font-bold text-teal-800">🎒 BagBuddy</a>
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
					class="rounded-lg px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-100 aria-[current=page]:bg-teal-50 aria-[current=page]:text-teal-800"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="mx-auto max-w-2xl px-4 py-6">
		{@render children()}
	</main>
</div>
