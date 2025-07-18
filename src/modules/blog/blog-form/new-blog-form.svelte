<script lang="ts">
	import { CircleAlert, LoaderIcon } from 'lucide-svelte';
	import { defaults, fileProxy, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';

	import type { Blog } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Alert from '$lib/components/ui/alert';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { Label } from '$lib/components/ui/label';
	import { RadioGroup, RadioGroupItem } from '$lib/components/ui/radio-group';
	import { Button } from '$lib/components/ui/button';
	import { createBlog } from '../mutations';
	import { newBlogSchema } from '../schemas';

	type Props = {
		blog?: Blog | null;
	};

	let { blog }: Props = $props();

	const client = useQueryClient();

	const createBlogMutation = createMutation({
		mutationKey: ['create-blog'],
		mutationFn: createBlog,
		onSuccess: () => {
			client.invalidateQueries({ queryKey: ['blog'] });
			toast.success('Blog created');
		}
	});

	const form = superForm(defaults(zod(newBlogSchema)), {
		SPA: true,
		validators: zodClient(newBlogSchema),
		resetForm: true,
		onUpdate({ form }) {
			if (form.valid) {
				$createBlogMutation.mutate(form.data);
			}
		}
	});

	const { form: formData, enhance } = form;

	const coverPhotoFile = fileProxy(form, 'image_url');

	$effect(() => {
		if (blog) {
			$formData = {
				title: blog.title,
				content: blog.content,
				visibility: blog.visibility,
				image_url: $coverPhotoFile[0]
			};
		}
	});
</script>

<form
	method="POST"
	use:enhance
	id="blog-record-form"
	class="grid w-full grid-cols-6 gap-x-6 gap-y-6"
>
	<Form.Field {form} name="title" class="col-span-6">
		<Form.Control>
			<Form.Label>Title</Form.Label>
			<Input placeholder="Your Post Title" type="text" bind:value={$formData.title} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="content" class="col-span-6">
		<Form.Control>
			<Form.Label>Content</Form.Label>
			<Textarea bind:value={$formData.content} />
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Label>Blog post image</Label>
	<Form.Field {form} name="image_url" class="col-span-6">
		<Form.Control>
			<Label
				class="hover:bg-muted relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-12 text-center transition"
			>
				<img
					src="https://placehold.co/400"
					alt="Upload Icon"
					class="mx-auto h-20 w-20 text-blue-400"
				/>
				<p class="text-sm font-medium">Upload Photo</p>
				<Input type="file" accept="image/*" bind:files={$coverPhotoFile} />
			</Label>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field {form} name="visibility" class="col-span-6">
		<Form.Control>
			<Form.Label>Visibility</Form.Label>
			<RadioGroup bind:value={$formData.visibility} class="mt-2 flex flex-col gap-3">
				<div class="flex items-start space-x-3">
					<RadioGroupItem id="visible" value="visible" />
					<Label for="visible" class="flex flex-col">
						<p class="font-medium">Visible</p>
					</Label>
				</div>
				<div class="flex items-start space-x-3">
					<RadioGroupItem id="invisible" value="invisible" />
					<Label for="invisible" class="flex flex-col">
						<p class="font-medium">Invisible</p>
					</Label>
				</div>
			</RadioGroup>
		</Form.Control>
		<Form.FieldErrors />
	</Form.Field>

	<div class="col-span-4 mt-2 flex flex-col gap-2">
		{#if $createBlogMutation.isPaused}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<div>
					<Alert.Title>You are offline</Alert.Title>
					<Alert.Description>Please connect to the internet.</Alert.Description>
				</div>
			</Alert.Root>
		{/if}

		{#if $createBlogMutation.isError}
			<Alert.Root variant="destructive" class="flex items-center gap-2">
				<CircleAlert class="h-5 w-5" />
				<Alert.Title>Something went wrong.</Alert.Title>
			</Alert.Root>
		{/if}
	</div>

	<div class="col-span-6 mt-2 mb-6 flex justify-end gap-3">
		<Button
			href="/blogs"
			class="inline-flex items-center rounded-md border border-gray-300 bg-white px-6 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
		>
			Cancel
		</Button>

		<Form.Button
			disabled={$createBlogMutation.isPending || $createBlogMutation.isPaused}
			class="inline-flex items-center rounded-md  px-6 py-2 text-sm font-medium text-white transition disabled:opacity-50"
		>
			{#if $createBlogMutation.isPending || $createBlogMutation.isPaused}
				<LoaderIcon class="mr-2 h-5 w-5 animate-spin" />
			{/if}
			Add
		</Form.Button>
	</div>
</form>
