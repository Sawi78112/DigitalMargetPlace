<script lang="ts">
	import { CheckIcon } from 'lucide-svelte';

	import Button from '$lib/components/ui/button/button.svelte';
</script>

<div class="flex flex-col items-center space-y-6">
	<div class="bg-muted relative flex h-20 w-20 items-center justify-center rounded-full">
		<CheckIcon class="h-8 w-8 text-green-500" />
	</div>

	<div class="flex flex-col space-y-2 text-center">
		<h1 class="text-xl font-semibold">Signup Complete!</h1>
		<p class="text-muted-foreground text-sm">You have successfully created your account.</p>
	</div>

	<Button href="/login" class="w-full rounded-full font-medium text-white">Next</Button>
</div>
