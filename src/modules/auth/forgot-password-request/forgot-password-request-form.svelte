<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Loader2Icon } from 'lucide-svelte';

	import { forgotPasswordRequest, forgotPasswordRequestSchema } from '..';
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';

	const forgotPasswordRequestMutation = createMutation({
		mutationKey: ['forgot-password-request'],
		mutationFn: forgotPasswordRequest,
		onSuccess: (e) => {
			toast.success('Password reset otp has been sent to your email');
			goto(`/forgot-password?id=${e.id}`);
		},
		onError: (e) => {
			if (e.status === 422) {
				toast.error('Email does not exists');
				return;
			}
			toast.error(e.message);
		}
	});

	const form = superForm(defaults(zod(forgotPasswordRequestSchema)), {
		SPA: true,
		validators: zodClient(forgotPasswordRequestSchema),
		onUpdate: ({ form }) => {
			if (form.valid) {
				$forgotPasswordRequestMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance>
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold">Forgot Password Request</h1>
		<h1 class="text-sm text-neutral-500">
			Enter your email to receive OTP code for resetting password
		</h1>
	</div>
	<Form.Field class="flex flex-col items-center justify-center" {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Email</Form.Label>
				<Input {...props} bind:value={$formData.email} />
			{/snippet}
		</Form.Control>
		<div class="text-center">
			<Form.FieldErrors class="text-sm" />
		</div>
		<div class="mt-auto flex w-full flex-1 flex-col space-y-4 py-4">
			<Form.Button disabled={$forgotPasswordRequestMutation.isPending} class="w-full">
				{#if $forgotPasswordRequestMutation.isPending}
					<Loader2Icon class="mr-2 size-4 animate-spin" />
					Submitting...
				{:else}
					Submit
				{/if}
			</Form.Button>
		</div>
	</Form.Field>
</form>
