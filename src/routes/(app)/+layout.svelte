<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AppSidebar } from '$modules/app/components';
	import { setCurrentUser } from '$modules/auth/current-user.svelte.js';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main class="container">
		<Sidebar.Trigger class="my-6" />
		{@render children?.()}
	</main>
</Sidebar.Provider>
