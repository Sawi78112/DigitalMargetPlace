<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();

	const queryClient = new QueryClient();
</script>

<svelte:head>
	<title>1Bataan READi</title>
</svelte:head>

<QueryClientProvider client={queryClient}>
	<Toaster richColors={true} position="top-center" />
	{@render children()}
	<SvelteQueryDevtools buttonPosition="bottom-right" initialIsOpen={false} />
</QueryClientProvider>
