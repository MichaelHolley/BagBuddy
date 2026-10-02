<script lang="ts">
	import { slide } from '#lib/motion.js';

	let { issues }: { issues: { message: string }[] | undefined } = $props();
</script>

{#each issues ?? [] as issue (issue.message)}
	<p class="mt-1 text-xs text-red-600" transition:slide>{issue.message}</p>
{/each}
