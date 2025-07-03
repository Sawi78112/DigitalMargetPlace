<script lang="ts">
	import { CircleAlert, Eye, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Alert from '$lib/components/ui/alert';
	import { updatePassword, updatePasswordSchema } from '$modules/profile';

	const client = useQueryClient();

	const updatePasswordMutation = createMutation({
		mutationKey: ['update-password'],
		mutationFn: updatePassword,
		onSuccess: () => {
			client.invalidateQueries({
				queryKey: ['password']
			});
			toast.success('Password updated');
			$formData.current_password = '';
			$formData.password = '';
		}
	});

	const form = superForm(defaults(zod(updatePasswordSchema)), {
		SPA: true,
		validators: zodClient(updatePasswordSchema),
		id: `edit-password`,
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				$updatePasswordMutation.mutate({
					password: form.data
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	let showPassword = false;
	let showConfirmPassword = false;
</script>

<div class="gap-4 px-4">
	<form method="POST" class="space-y-8 pb-12" use:enhance id="password-form">
		<div class="grid grid-cols-2 gap-4">
			<Form.Field {form} name="current_password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Current Password</Form.Label>
						<div class="relative">
							<Input
								{...props}
								type={showPassword ? 'text' : 'password'}
								bind:value={$formData.current_password}
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

			<Form.Field {form} name="password">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>New Password</Form.Label>
						<div class="relative">
							<Input
								{...props}
								type={showConfirmPassword ? 'text' : 'password'}
								bind:value={$formData.password}
							/>
							<button
								type="button"
								class="absolute inset-y-0 right-2 flex items-center"
								onclick={() => (showConfirmPassword = !showConfirmPassword)}
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

			{#if $updatePasswordMutation.isPaused}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>You are offline</Alert.Title>
					<Alert.Description>Please connect to the internet.</Alert.Description>
				</Alert.Root>
			{/if}
			{#if $updatePasswordMutation.isError}
				<Alert.Root variant="destructive">
					<CircleAlert class="h-4 w-4" />
					<Alert.Title>Something went wrong.</Alert.Title>
				</Alert.Root>
			{/if}
		</div>

		<div class="flex justify-end">
			<Button
				onclick={() => form.submit()}
				disabled={$updatePasswordMutation.isPending || $updatePasswordMutation.isPaused}
			>
				{#if $updatePasswordMutation.isPending || $updatePasswordMutation.isPaused}
					<LoaderIcon class="mr-1 size-4 animate-spin" />
				{/if}
				Update Password
			</Button>
		</div>
	</form>
</div>
