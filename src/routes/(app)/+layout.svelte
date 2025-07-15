<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { AppSidebar } from '$modules/app/components';
	import { getUserMe, setCurrentUser } from '$modules/auth';
	import { Header } from '$lib/components/header';
	import { createQuery } from '@tanstack/svelte-query';
	import { useCurrentUser } from '$modules/auth/hooks/use-current-user.js';

	let { children, data } = $props();

	const currentUser = useCurrentUser(data.user);

	setCurrentUser(data.user);

	$inspect(data.user);
</script>

<Sidebar.Provider class="bg-secondary border-r-0">
	<AppSidebar />

	<div class="mx-8 my-4 flex w-full flex-1 flex-col space-y-4">
		<Header />
		<main class="h-full flex-1 space-y-4 rounded-xl bg-white p-6">
			{@render children?.()}
		</main>
	</div>
</Sidebar.Provider>
