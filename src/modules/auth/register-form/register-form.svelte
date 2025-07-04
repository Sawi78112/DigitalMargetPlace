<script lang="ts">
	import { CircleAlert, Eye, EyeOff, Loader2Icon, Camera, UserRoundIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation } from '@tanstack/svelte-query';

	import { register, registerSchema } from '..';

	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
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
				$registerMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;

	let showPassword = false;
</script>

<div class="flex flex-col pb-6">
	<h1 class="pb-1 text-2xl font-semibold">Sign Up</h1>
	<p class="text-muted-foreground text-sm">
		Please upload your photo and input required informations below
	</p>
</div>

<div class="bg-muted relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
	<UserRoundIcon class="text-muted-foreground h-8 w-8" />

	<label
		for="file-upload"
		class="bg-primary absolute right-0 bottom-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-white"
		title="Upload Photo"
	>
		<Camera class="h-4 w-4" />
	</label>

	<input id="file-upload" type="file" class="hidden" accept="image/*" />
</div>

<form method="POST" use:enhance class="space-y-4">
	<Form.Field {form} name="full_name">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="pb-1">Full Name</Form.Label>
				<Input
					{...props}
					bind:value={$formData.full_name}
					placeholder="Enter Full Name"
					class="rounded-full"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="username">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="pb-1">Username</Form.Label>
				<Input
					{...props}
					bind:value={$formData.username}
					placeholder="Enter Username"
					class="rounded-full"
				/>
			{/snippet}
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="pb-1">Email Address</Form.Label>
				<Input
					{...props}
					type="email"
					bind:value={$formData.email}
					placeholder="Enter Email Address"
					class="rounded-full"
				/>
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
						placeholder="Enter Password"
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
			<Alert.Title>Email or password is incorrect</Alert.Title>
		</Alert.Root>
	{/if}

	<Form.Button class="w-full rounded-full  text-white" disabled={$registerMutation.isPending}>
		{#if $registerMutation.isPending}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
			Signing up...
		{:else}
			Next
		{/if}
	</Form.Button>
</form>

<div class="pt-6 text-center text-sm">
	Already have an account?
	<Button href="/login" variant="link" class="text-sm font-medium">Sign In</Button>
</div>
