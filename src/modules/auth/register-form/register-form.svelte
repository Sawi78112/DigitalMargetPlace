<script lang="ts">
	import { CircleAlert, Eye, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';

	import { register, registerSchema } from '..';

	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Icons } from '$lib/components/icons';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { auth } from '$lib/api';

	const registerMutation = createMutation({
		mutationKey: ['register'],
		mutationFn: register,
		onSuccess: (data) => {
			const { token, token_expiry } = data;
			auth.setToken(token, new Date(token_expiry));
			goto('/u');
		}
	});

	const form = superForm(defaults(zod(registerSchema)), {
		SPA: true,
		validators: zodClient(registerSchema),
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				const { confirmPassword, ...data } = form.data;

				$registerMutation.mutate(data);
			}
		}
	});

	const { form: formData, enhance } = form;

	let showPassword = false;
	let showConfirmPassword = false;
</script>

<form method="POST" use:enhance class="w-full space-y-4">
	<div class="space-y-4">
		<Form.Field {form} name="email">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Email</Form.Label>
					<Input {...props} type="email" bind:value={$formData.email} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="password">
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

		<Form.Field {form} name="confirmPassword">
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

		{#if $registerMutation.isPaused}
			<Alert.Root variant="destructive">
				<CircleAlert class="size-4" />
				<Alert.Title>You are offline</Alert.Title>
				<Alert.Description>Please connect to the internet.</Alert.Description>
			</Alert.Root>
		{/if}
		{#if $registerMutation.isError}
			<Alert.Root variant="destructive">
				<CircleAlert class="size-4" />
				<Alert.Title>Details Incorrect</Alert.Title>
			</Alert.Root>
		{/if}
	</div>

	<Form.Button class="w-full" disabled={$registerMutation.isPending || $registerMutation.isPaused}>
		{#if $registerMutation.isPending || $registerMutation.isPaused}
			<LoaderIcon class="mr-1 size-4 animate-spin" />
		{/if}
		Register
	</Form.Button>
</form>

<div class="relative">
	<div class="absolute inset-0 flex items-center">
		<span class="w-full border-t"></span>
	</div>
	<div class="relative flex justify-center text-xs uppercase">
		<span class="bg-background px-2 text-muted-foreground"> Or continue with </span>
	</div>
</div>
<Button variant="outline" type="button">
	<Icons.google class="mr-2 size-4" />
	Google
</Button>
