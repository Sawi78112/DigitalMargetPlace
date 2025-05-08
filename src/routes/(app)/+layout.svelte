<script lang="ts">
	import { setCurrentUser } from '$modules/auth/current-user.svelte.js';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<main class="container">
	{@render children?.()}
</main>
