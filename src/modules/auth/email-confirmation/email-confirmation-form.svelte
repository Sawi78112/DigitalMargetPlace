<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';
	import { emailConfirmation, emailConfirmationRequest, emailConfirmationSchema } from '..';
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import Button from '$lib/components/ui/button/button.svelte';

	const emailConfirmationMutation = createMutation({
		mutationKey: ['email-confirmation'],
		mutationFn: emailConfirmation,
		onSuccess: () => {
			toast.message('Email verified successfully');
			goto('/sign-up-complete');
		},
		onError: (e) => {
			if (e.status === 422) {
				toast.error(e.fieldErrors!.code);
				return;
			}

			if (e.status === 404) {
				toast.error('Please request new email OTP');
				return;
			}

			toast.error(e.message);
		}
	});

	const emailConfirmationRequestMutation = createMutation({
		mutationKey: ['email-confirmation-request'],
		mutationFn: emailConfirmationRequest,
		onSuccess: () => {
			toast.success('New email otp has been sent to your email');
		},
		onError: (e) => {
			toast.error(e.message);
		}
	});

	const form = superForm(defaults(zod(emailConfirmationSchema)), {
		SPA: true,
		validators: zodClient(emailConfirmationSchema),
		onUpdate: ({ form }) => {
			if (form.valid) {
				$emailConfirmationMutation.mutate(form.data);
			}
		}
	});

	let codeDigits = ['', '', '', '', '', ''];

	const { form: formData, enhance } = form;

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const paste = event.clipboardData?.getData('text') ?? '';
		const chars = paste.trim().slice(0, 6).split('');
		for (let i = 0; i < 6; i++) {
			codeDigits[i] = chars[i] ?? '';
		}
	}

	$: $formData.code = codeDigits.join('');

	function handleSubmit(event: Event) {
		event.preventDefault();
		if (codeDigits.some((d) => d === '')) {
			toast.error('Please enter all 6 digits.');
			return;
		}
		$emailConfirmationMutation.mutate({ code: codeDigits.join('') });
	}
</script>

<form onsubmit={handleSubmit} use:enhance class="space-y-4">
	<div>
		<h1 class="text-xl font-semibold">Authentication</h1>
		<p class="mt-1 text-sm text-neutral-500">We sent authentication to</p>
	</div>

	<Form.Field name="code" {form} class="w-full">
		<Form.Control>
			<div class="flex gap-3">
				{#each Array(6) as _, i}
					<input
						type="text"
						maxlength="1"
						bind:value={codeDigits[i]}
						onpaste={handlePaste}
						class="h-12 w-12 rounded-full border border-gray-300 text-center text-xl focus:ring-2 focus:ring-blue-500"
					/>
				{/each}
			</div>
		</Form.Control>
		<div class="mt-2 text-center">
			<Form.FieldErrors class="text-xs text-red-500" />
		</div>
	</Form.Field>

	<Form.Button
		disabled={$emailConfirmationMutation.isPending}
		class="flex w-full  rounded-full font-medium text-white"
	>
		{#if $emailConfirmationMutation.isPending}
			<Loader2Icon class="mr-2 size-4 animate-spin" />
			Submitting...
		{:else}
			Submit
		{/if}
	</Form.Button>

	<div class="text-center text-sm">
		Didn’t receive an email?
		<Button
			onclick={() => $emailConfirmationRequestMutation.mutate()}
			variant="link"
			class="text-sm font-medium">Request new code</Button
		>
	</div>
</form>
