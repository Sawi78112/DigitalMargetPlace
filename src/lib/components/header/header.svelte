<script lang="ts">
	import { ArrowLeftIcon } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';

	export let title: string;
</script>

<header class="flex items-center gap-3 py-5">
	<Button
		class="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
		onclick={() => history.back()}
	>
		<ArrowLeftIcon class="h-4 w-4" />
	</Button>

	<h1 class="text-xl">{title}</h1>
</header>
