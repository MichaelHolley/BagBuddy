<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-800">
	<h1 class="text-2xl font-bold">{page.status}</h1>
	<p class="mt-1">{page.error?.message ?? 'Something went wrong.'}</p>
	<a href="/" class="mt-4 btn-secondary">Back to trips</a>
</div>
