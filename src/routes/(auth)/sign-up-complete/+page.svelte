<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Check } from 'lucide-svelte';
</script>

<div class="grid min-h-screen grid-cols-1 lg:grid-cols-2">
	<div class="relative hidden h-full lg:flex dark:border-r">
		<div class="absolute inset-0 bg-[url('/img/dmp-bg.jpg')] bg-cover bg-right bg-no-repeat"></div>
	</div>

	<div class="flex min-h-screen flex-col items-center justify-center px-4">
		<div class="flex w-full max-w-md flex-col items-center space-y-6">
			<div class="bg-muted relative flex h-20 w-20 items-center justify-center rounded-full">
				<Check class="h-8 w-8 text-green-500" />
			</div>

			<div class="flex flex-col space-y-2 text-center">
				<h1 class="text-xl font-semibold">Signup Complete!</h1>
				<p class="text-muted-foreground text-sm">You have successfully created your account.</p>
			</div>

			<Button href="/login" class="w-full rounded-full font-medium text-white">Next</Button>
		</div>
	</div>
</div>
