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

	let codeDigits = ['', '', '', '', '', ''];

	function handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		const paste = event.clipboardData?.getData('text') ?? '';
		const chars = paste.trim().slice(0, 6).split('');
		for (let i = 0; i < 6; i++) {
			codeDigits[i] = chars[i] ?? '';
		}
	}

	function handleSubmit() {
		if (codeDigits.some((d) => d === '')) {
			toast.error('Please enter all 6 digits.');
			return;
		}
		if (!$formData.password || !$formData.confirmPassword) {
			toast.error('Please enter the password fields.');
			return;
		}
		if ($formData.password !== $formData.confirmPassword) {
			toast.error("Passwords don't match.");
			return;
		}
		const data = {
			code: codeDigits.join(''),
			password: $formData.password
		};

		$forgotPasswordMutation.mutate(data);
	}
</script>

<div class="flex flex-col pb-6">
	<h1 class="text-2xl font-semibold">Create New Password</h1>
	<!-- <p class="text-muted-foreground text-sm">We sent authentication to</p> -->
</div>

<form onsubmit={handleSubmit} class="space-y-4">
	<Form.Field name="code" {form} class="w-full">
		<Form.Control>
			<Form.Label>Otp</Form.Label>
			<div class="flex gap-3">
				{#each Array(6) as _, i}
					<input
						type="text"
						maxlength="1"
						bind:value={codeDigits[i]}
						onpaste={handlePaste}
						class="h-12 w-12 rounded-full border border-gray-300 text-center text-xl focus:ring-2 focus:ring-blue-500"
					/>
				{/each}
			</div>
		</Form.Control>
		<div class="mt-2 text-center">
			<Form.FieldErrors class="text-xs text-red-500" />
		</div>
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
