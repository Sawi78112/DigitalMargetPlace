<script lang="ts">
	import { CircleAlert, Loader2Icon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';

	import { login, loginSchema } from '..';

	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Icons } from '$lib/components/icons';
	import { goto } from '$app/navigation';
	import * as Form from '$lib/components/ui/form';
	import * as Alert from '$lib/components/ui/alert';
	import { auth } from '$lib/api';

	const loginMutation = createMutation({
		mutationKey: ['login'],
		mutationFn: login,
		onSuccess: (data) => {
			const { token, token_expiry } = data;
			auth.setToken(token, new Date(token_expiry));
			goto('/home');
		},
		onError: () => {
			toast.error('Email or Password is incorrect');
		}
	});

	const form = superForm(defaults(zod(loginSchema)), {
		SPA: true,
		validators: zodClient(loginSchema),
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				$loginMutation.mutate(form.data);
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

		{#if $loginMutation.isPaused}
			<Alert.Root variant="destructive">
				<CircleAlert class="size-4" />
				<Alert.Title>You are offline</Alert.Title>
				<Alert.Description>Please connect to the internet.</Alert.Description>
			</Alert.Root>
		{/if}
		{#if $loginMutation.isError}
			<Alert.Root variant="destructive">
				<CircleAlert class="size-4" />
				<Alert.Title>Email or password is incorrect</Alert.Title>
			</Alert.Root>
		{/if}
	</div>
	<!-- <Form.Button class="w-full" disabled={$loginMutation.isPending || $loginMutation.isPaused}>
		{#if $loginMutation.isPending || $loginMutation.isPaused}
			<LoaderIcon class="mr-1 size-4 animate-spin" />
		{/if}
		Login
	</Form.Button> -->

	<div>
		<Button href="/forgot-password/request" variant="link" class="h-0 p-0 text-gray-500 underline">
			Forgot password?
		</Button>
	</div>

	<div class="mt-auto flex flex-col space-y-4 py-4">
		<Form.Button disabled={$loginMutation.isPending}>
			{#if $loginMutation.isPending}
				<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
				Logging in...
			{:else}
				Login
			{/if}
		</Form.Button>
		<Button href="/register" variant="outline" class="border-primary  border-2">
			Don't have an account?
		</Button>
	</div>
</form>

<div class="relative">
	<div class="absolute inset-0 flex items-center">
		<span class="w-full border-t"></span>
	</div>
	<div class="relative flex justify-center text-xs uppercase">
		<span class="bg-background text-muted-foreground px-2"> Or continue with </span>
	</div>
</div>

<Button variant="outline" type="button">
	<Icons.google class="mr-2 size-4" />
	Google
</Button>
