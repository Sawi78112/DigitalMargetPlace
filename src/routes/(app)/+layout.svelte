<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AppSidebar } from '$modules/app/components';
	import { setCurrentUser } from '$modules/auth/current-user.svelte.js';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<Sidebar.Provider class="bg-gray-100 p-4">
	<AppSidebar />
	<main class="container bg-white">
		{@render children?.()}
	</main>
</Sidebar.Provider>
