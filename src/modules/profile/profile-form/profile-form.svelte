<script lang="ts">
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { createProfile, newProfileSchema, updateProfile } from '..';
	import type { Profile } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import { Dropdown } from '$lib/components/dropdown';
	import { GENDER } from '$modules/app';

	type Props = {
		profile?: Profile | null;
		userId: string;
	};

	let { profile, userId }: Props = $props();

	const client = useQueryClient();

	const createProfileMutation = createMutation<typeof createProfile, unknown, Parameters<typeof createProfile>[0]>({
		mutationKey: ['create-profile'],
		mutationFn: createProfile,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['profile'] });
			toast.success('Profile created');
		}
	});

	const updateProfileMutation = createMutation({
		mutationKey: ['update-profile'],
		mutationFn: updateProfile,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['user-profile', userId] });
			toast.success('Profile updated');
		}
	});

	const form = superForm(defaults(zod(newProfileSchema)), {
		SPA: true,
		resetForm: false,
		validators: zodClient(newProfileSchema),
		onSubmit() {
			if (profile) {
				$updateProfileMutation.mutate({
					...$formData,
					id: profile.id,
					user_id: userId
				});
			} else {
				$createProfileMutation.mutate({
					...$formData,
					user_id: userId
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (profile) {
			$formData = {
				...profile,
				user_id: userId,
				birthdate: new Date(profile.birthdate).toISOString().split('T')[0]
			};
		}
	});
</script>

<div class="gap-4 px-4">
	<form method="POST" use:enhance id="profile-form" class="grid w-full grid-cols-4 gap-x-4 gap-y-2">
		<Form.Field {form} class="col-span-2" name="first_name">
			<Form.Control>
				<Form.Label>First Name</Form.Label>
				<Input bind:value={$formData.first_name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="col-span-2" name="middle_name">
			<Form.Control>
				<Form.Label>Middle Name</Form.Label>
				<Input bind:value={$formData.middle_name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="col-span-2" name="last_name">
			<Form.Control>
				<Form.Label>Last Name</Form.Label>
				<Input bind:value={$formData.last_name} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} class="col-span-2" name="birthdate">
			<Form.Control>
				<Form.Label>Birthday</Form.Label>
				<Input type="date" bind:value={$formData.birthdate} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		<Form.Field {form} name="gender">
			<Form.Control>
				<Form.Label>Gender</Form.Label>
				<Dropdown placeholder="gender" bind:selectedValue={$formData.gender} options={GENDER} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>

		{#if $createProfileMutation.isPaused}
			<Alert.Root variant="destructive" class="mt-2">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>You are offline</Alert.Title>
				<Alert.Description>Please connect to the internet.</Alert.Description>
			</Alert.Root>
		{/if}
		{#if $createProfileMutation.isError}
			<Alert.Root variant="destructive" class="mt-2">
				<CircleAlert class="h-4 w-4" />
				<Alert.Title>Something went wrong.</Alert.Title>
			</Alert.Root>
		{/if}
		<div class="col-span-4 flex justify-end">
			<Form.Button
				disabled={$createProfileMutation.isPending ||
					$createProfileMutation.isPaused ||
					$updateProfileMutation.isPending ||
					$updateProfileMutation.isPaused}
			>
				{#if $createProfileMutation.isPending || $createProfileMutation.isPaused || $updateProfileMutation.isPending || $updateProfileMutation.isPaused}
					<LoaderIcon class="mr-1 h-4 w-4 animate-spin" />
				{/if}

				{#if profile}
					Update
				{:else}
					Submit
				{/if}
			</Form.Button>
		</div>
	</form>
</div>
