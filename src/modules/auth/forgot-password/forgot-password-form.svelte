<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Eye, Loader2Icon } from 'lucide-svelte';

	import { forgotPassword, forgotPasswordSchema } from '..';
	import { goto } from '$app/navigation';

	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';

	const forgotPasswordMutation = createMutation({
		mutationKey: ['forgot-password'],
		mutationFn: forgotPassword,
		onSuccess: () => {
			toast.success('Password reset successfully!');
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

	const form = superForm(defaults(zod(forgotPasswordSchema)), {
		SPA: true,
		validators: zodClient(forgotPasswordSchema),
		onUpdate: ({ form }) => {
			if (form.valid) {
				$forgotPasswordMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;

	let showPassword = false;
	let showConfirmPassword = false;
</script>

<form method="POST" use:enhance>
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold">Forgot Password</h1>
		<h1 class="text-sm text-neutral-500">Enter your otp and new password</h1>
	</div>
	<div class="flex flex-col items-center justify-center gap-3">
		<Form.Field class="w-full" {form} name="code">
			<Form.Control>
				{#snippet children({ props })}
					<Input {...props} placeholder="Enter your OTP" bind:value={$formData.code} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="w-full" name="password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Password</Form.Label>
					<div class="relative">
						<Input
							{...props}
							type={showPassword ? 'text' : 'password'}
							bind:value={$formData.password}
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-2 flex items-center"
							on:click={() => (showPassword = !showPassword)}
							tabindex="-1"
						>
							<Eye
								class="size-4 transition-colors duration-200 {showPassword
									? 'text-foreground'
									: 'text-muted-foreground'}"
							/>
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="w-full" name="confirmPassword">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<div class="relative">
						<Input
							{...props}
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={$formData.confirmPassword}
						/>
						<button
							type="button"
							class="absolute inset-y-0 right-2 flex items-center"
							on:click={() => (showConfirmPassword = !showConfirmPassword)}
							tabindex="-1"
						>
							<Eye
								class="size-4 transition-colors duration-200 {showConfirmPassword
									? 'text-foreground'
									: 'text-muted-foreground'}"
							/>
						</button>
					</div>
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</div>
	<div class="mt-auto flex w-full flex-1 flex-col space-y-4 py-4">
		<Form.Button disabled={$forgotPasswordMutation.isPending} class="w-full">
			{#if $forgotPasswordMutation.isPending}
				<Loader2Icon class="mr-2 size-4 animate-spin" />
				Submitting...
			{:else}
				Submit
			{/if}
		</Form.Button>
	</div>
</form>
