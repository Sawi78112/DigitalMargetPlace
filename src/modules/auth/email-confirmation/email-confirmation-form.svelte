<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';

	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';
	import { emailConfirmation, emailConfirmationRequest, emailConfirmationSchema } from '..';
	import { goto } from '$app/navigation';
	import * as InputOTP from '$lib/components/ui/input-otp';
	import * as Form from '$lib/components/ui/form';

	const emailConfirmationMutation = createMutation({
		mutationKey: ['email-confirmation'],
		mutationFn: emailConfirmation,
		onSuccess: () => {
			toast.message('Email verified successfully');
			goto('/home');
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
		mutationKey: ['email-confirmation'],
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

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold">Email Confirmation</h1>
		<h1 class="text-sm text-neutral-500">Enter confirmation code</h1>
	</div>
	<Form.Field class="flex flex-col items-center justify-center" {form} name="code">
		<Form.Control>
			<InputOTP.Root maxlength={6} bind:value={$formData.code}>
				{#snippet children({ cells })}
					<InputOTP.Group>
						{#each cells.slice(0, 3) as cell}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
					<InputOTP.Separator />
					<InputOTP.Group>
						{#each cells.slice(3, 6) as cell}
							<InputOTP.Slot {cell} />
						{/each}
					</InputOTP.Group>
				{/snippet}
			</InputOTP.Root>
		</Form.Control>
		<div class="text-center">
			<Form.FieldErrors class="text-sm" />
		</div>
		<div class="mt-auto flex w-full flex-1 flex-col space-y-4 py-4">
			<Form.Button disabled={$emailConfirmationMutation.isPending} class="w-full">
				{#if $emailConfirmationMutation.isPending}
					<Loader2Icon class="mr-2 size-4 animate-spin" />
					Submitting...
				{:else}
					Submit
				{/if}
			</Form.Button>
		</div>
	</Form.Field>
</form>

<div class="text-center">
	<p class="text-xs text-neutral-500">Did not receive email from us?</p>
	<button onclick={() => $emailConfirmationRequestMutation.mutate()} class="border-0 text-xs"
		>Request new code</button
	>
</div>
