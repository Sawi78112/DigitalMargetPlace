<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AppSidebar } from '$modules/app/components';
	import { setCurrentUser } from '$modules/auth/current-user.svelte.js';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<Sidebar.Provider class="">
	<AppSidebar />
	<main class="container mx-auto rounded-xl bg-white px-10 py-6">
		{@render children?.()}
	</main>
</Sidebar.Provider>
