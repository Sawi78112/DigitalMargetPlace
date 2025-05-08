<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { cn } from '$lib/utils.js';
	import Google from '$lib/components/icons/google.svelte';
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { type DefaultError, createMutation } from '@tanstack/svelte-query';
	import { type AuthResults, type RegisterSchema, register, registerSchema } from '..';
	import { invalidateAll } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { setAuthToken } from '$lib/api';

	const registerMutation = createMutation<AuthResults, DefaultError, RegisterSchema>({
		mutationKey: ['register'],
		mutationFn: register,
		onSuccess: (data) => {
			const { token } = data;
			if (token) {
				setAuthToken(token);
				invalidateAll();
			}
		},
		onError: ({ message }) => {
			console.log(message);
		}
	});

	const form = superForm(defaults(zod(registerSchema)), {
		SPA: true,
		validators: zodClient(registerSchema),
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				const { confirm_password, ...data } = form.data;

				$registerMutation.mutate(data);
			}
		}
	});

	const { form: formData, enhance } = form;
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
					<Input {...props} type="password" bind:value={$formData.password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="confirm_password">
			<Form.Control>
				{#snippet children({ props })}
					<Form.Label>Confirm Password</Form.Label>
					<Input {...props} type="password" bind:value={$formData.confirm_password} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		{#if $registerMutation.isPaused}
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>You are offline</Alert.Title>
				<Alert.Description>Please connect to the internet.</Alert.Description>
			</Alert.Root>
		{/if}
		{#if $registerMutation.isError}
			<Alert.Root variant="destructive">
				<CircleAlert class="h-4 w-4" />
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
	<!-- {#if $registerMutation.isPending || $registerMutation.isPaused}
		<LoaderIcon class="mr-1 size-4 animate-spin" />
	{:else} -->
	<Google class="mr-2 h-4 w-4" />
	<!-- {/if} -->
	Google
</Button>
