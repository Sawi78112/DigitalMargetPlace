<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';
	import { otp, otpSchema } from '..';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	const otpMutation = createMutation({
		mutationKey: ['otp'],
		mutationFn: otp,
		onSuccess: () => {
			toast.success('Verified');
			goto('/login');
		},
		onError: (e) => {
			if (e.status === 422) {
				toast.error('Invalid OTP Code');
				return;
			}
			toast.error(e.message);
		}
	});

	const form = superForm(defaults(zod(otpSchema)), {
		SPA: true,
		validators: zodClient(otpSchema)
	});

	const { form: formData, enhance } = form;

	let codeDigits = ['', '', '', '', '', ''];

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (codeDigits.some((digit) => digit === '')) {
			toast.error('Please enter all 6 digits');
			return;
		}
		$otpMutation.mutate({ code: codeDigits });
	}
</script>

<div class="flex flex-col space-y-4 pb-6">
	<h1 class="text-xl font-semibold">Authentication</h1>
	<p class="text-muted-foreground text-sm">
		We sent authentication to <strong>miguelsmith@gmail.com</strong>
	</p>
</div>

<form method="POST" use:enhance class="space-y-6" onsubmit={handleSubmit}>
	<div class="flex gap-2">
		{#each Array(6) as _, i}
			<input
				type="text"
				maxlength="1"
				class="h-12 w-12 rounded-full border border-gray-300 text-center text-xl"
				bind:value={codeDigits[i]}
			/>
		{/each}
	</div>

	<Button
		type="submit"
		class="flex w-full  rounded-full font-medium text-white"
		disabled={$otpMutation.isPending}
	>
		{#if $otpMutation.isPending}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
			Submitting...
		{:else}
			Next
		{/if}
	</Button>
</form>
