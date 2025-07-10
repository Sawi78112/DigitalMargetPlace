<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { Eye, EyeOff, Loader2Icon } from 'lucide-svelte';

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

<div class="flex flex-col pb-6">
	<h1 class="text-2xl font-semibold">Create New Password</h1>
</div>

<form method="POST" use:enhance class="space-y-4">
	<Form.Field {form} class="w-full" name="code">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>OTP Code</Form.Label>
				<div class="relative">
					<Input
						{...props}
						type="text"
						bind:value={$formData.code}
						placeholder="Enter OTP Code"
						class="rounded-full pr-10"
					/>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} class="w-full" name="password">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>New Password</Form.Label>
				<div class="relative">
					<Input
						{...props}
						type={showPassword ? 'text' : 'password'}
						bind:value={$formData.password}
						placeholder="Enter New Password"
						class="rounded-full pr-10"
					/>

					<button
						type="button"
						class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
						onclick={() => (showPassword = !showPassword)}
						tabindex="-1"
					>
						{#if showPassword}
							<Eye class="size-4" />
						{:else}
							<EyeOff class="size-4" />
						{/if}
					</button>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} class="w-full" name="confirmPassword">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Re-enter New Password</Form.Label>
				<div class="relative">
					<Input
						{...props}
						type={showConfirmPassword ? 'text' : 'password'}
						bind:value={$formData.confirmPassword}
						placeholder="Re-enter New Password"
						class="rounded-full pr-10"
					/>

					<button
						type="button"
						class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2"
						onclick={() => (showConfirmPassword = !showConfirmPassword)}
						tabindex="-1"
					>
						{#if showConfirmPassword}
							<Eye class="size-4" />
						{:else}
							<EyeOff class="size-4" />
						{/if}
					</button>
				</div>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Button
		disabled={$forgotPasswordMutation.isPending}
		class="w-full rounded-full font-medium text-white"
	>
		{#if $forgotPasswordMutation.isPending}
			<Loader2Icon class="mr-2 size-4 animate-spin" />
			Submitting...
		{:else}
			Next
		{/if}
	</Form.Button>
</form>
