<script lang="ts" module>
	const paths = {
		plus: 'M12 5v14M5 12h14',
		minus: 'M5 12h14',
		trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
		copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
		reset: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5',
		check: 'M5 12l5 5L20 7',
		back: 'M15 18l-6-6 6-6',
		chevron: 'M6 9l6 6 6-6',
		close: 'M18 6 6 18M6 6l12 12'
	};

	export type IconName = keyof typeof paths;
</script>

<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { name, class: className = 'size-5' }: { name: IconName; class?: ClassValue } = $props();
</script>

<svg
	class={className}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
