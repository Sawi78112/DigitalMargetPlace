<script lang="ts">
	import { CircleAlert, Eye, Loader2Icon } from 'lucide-svelte';
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
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';

	const loginMutation = createMutation({
		mutationKey: ['login'],
		mutationFn: login,
		onSuccess: (data) => {
			const { token, token_expiry } = data;
			auth.setToken(token, new Date(token_expiry));
			goto('/home');
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

	let showPassword = false;
</script>

<div class="flex flex-col pb-6">
	<h1 class="text-2xl font-semibold">Sign In</h1>
	<p class="text-muted-foreground text-sm">Welcome back!</p>
</div>

<form method="POST" use:enhance class="space-y-4">
	<Form.Field {form} name="email">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label class="pb-1">Email Address</Form.Label>
				<Input {...props} type="email" placeholder="Enter Email Address" class="rounded-full" />
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
						class="rounded-full"
					/>
					<button
						type="button"
						class="absolute inset-y-0 right-2 flex items-center"
						onclick={() => (showPassword = !showPassword)}
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

	<div class="flex items-center justify-between text-sm">
		<Label class="flex items-center space-x-2">
			<Checkbox id="remember" />
			<span>Remember Me</span>
		</Label>
		<Button href="/forgot-password/request" variant="link" class="text-sm">Forgot Password?</Button>
	</div>

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

	<Form.Button class="w-full rounded-full  text-white " disabled={$loginMutation.isPending}>
		{#if $loginMutation.isPending}
			<Loader2Icon class="mr-2 h-4 w-4 animate-spin" />
			Logging in...
		{:else}
			Next
		{/if}
	</Form.Button>
</form>

<div class="relative my-6">
	<div class="absolute inset-0 flex items-center">
		<span class="w-full border-t"></span>
	</div>
	<div class="relative flex justify-center text-xs uppercase">
		<span class="bg-background text-muted-foreground px-2"> Or Register with </span>
	</div>
</div>

<div class="space-y-2">
	<Button variant="outline" type="button" class="w-full rounded-full">
		<Icons.google class="mr-2 size-4" />
		Sign Up with Google
	</Button>
	<Button variant="outline" type="button" class="w-full rounded-full">
		<Icons.apple class="mr-2 size-4" />
		Sign Up with Apple
	</Button>
</div>

<div class="pt-6 text-center text-sm">
	Don't have an account?
	<Button href="/register" variant="link" class="text-sm font-medium">Sign Up</Button>
</div>
