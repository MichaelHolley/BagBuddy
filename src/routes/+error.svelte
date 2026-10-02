<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="rounded-[20px] bg-white p-6 text-center">
	<h1 class="heading">{page.status}</h1>
	<p class="mt-1">{page.error?.message ?? 'Something went wrong.'}</p>
	<a href="/" class="mt-4 btn-secondary">Back to trips</a>
</div>
