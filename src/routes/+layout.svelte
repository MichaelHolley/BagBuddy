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

<div class="min-h-dvh bg-paper text-ink antialiased">
	<header class="sticky top-0 z-10 rounded-b-[28px] bg-lime">
		<nav class="mx-auto flex max-w-2xl items-center gap-1 px-4 py-3">
			<a href="/" class="mr-auto text-xl font-medium tracking-[-0.03em]">bagbuddy</a>
			{#each links as link (link.href)}
				<a
					href={link.href}
					aria-current={page.url.pathname === link.href ? 'page' : undefined}
					class="rounded-full px-4 py-1.5 text-sm font-medium transition hover:bg-ink/10 aria-[current=page]:bg-ink aria-[current=page]:text-paper"
				>
					{link.label}
				</a>
			{/each}
		</nav>
	</header>

	<main class="mx-auto max-w-2xl px-4 pt-10 pb-8">
		{@render children()}
	</main>
</div>
