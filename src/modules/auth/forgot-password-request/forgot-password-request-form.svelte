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

<div class="flex flex-col pb-6">
	<h1 class="text-2xl font-semibold">Forgot Password</h1>
	<p class="text-muted-foreground text-sm">
		Please input your email address below to request a reset password link
	</p>
</div>

<form method="POST" use:enhance class="space-y-4">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="pb-1">Email Address</Form.Label>
				<Input
					{...props}
					type="email"
					placeholder="Enter Email Address"
					bind:value={$formData.email}
					class="rounded-full"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button
		disabled={$forgotPasswordRequestMutation.isPending}
		class="w-full rounded-full  text-white"
	>
		{#if $forgotPasswordRequestMutation.isPending}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
			Submitting...
		{:else}
			Submit
		{/if}
	</Form.Button>
</form>
