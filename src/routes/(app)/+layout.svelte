<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { Input } from '$lib/components/ui/input';
	import { AppSidebar } from '$modules/app/components';
	import { setCurrentUser } from '$modules/auth/current-user.svelte.js';
	import { Header } from '$lib/components/header';

	let { children, data } = $props();

	setCurrentUser(data.user);
</script>

<Sidebar.Provider class="bg-secondary border-r-0">
	<AppSidebar />

	<div class="mx-8 my-4 flex w-full flex-1 flex-col space-y-4">
		<Header />
		<main class="h-full flex-1 rounded-xl bg-white p-6">
			{@render children?.()}
		</main>
	</div>
</Sidebar.Provider>
