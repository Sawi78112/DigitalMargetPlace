<script lang="ts">
	import { LoaderIcon } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod, zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { createMutation, createQuery, useQueryClient } from '@tanstack/svelte-query';

	import { getCategories, updateProduct, updateProductSchema } from '..';

	import { Dropdown } from '$lib/components/dropdown';
	import type { Product } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { ScrollArea } from '$lib/components/ui/scroll-area';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { reactiveQueryArgs } from '$lib/components/svelte-query';

	type Props = {
		product: Product;
	};

	let { product }: Props = $props();
	let open = $state(false);

	const client = useQueryClient();

	const categoriesQuery = createQuery(
		reactiveQueryArgs(() => ({
			queryKey: ['categories'],
			queryFn: () => getCategories()
		}))
	);

	const categories = $derived($categoriesQuery.data ?? []);

	const categoryNames = $derived(categories.map((c) => c.name));

	const updateProductMutation = createMutation({
		mutationKey: ['update-product'],
		mutationFn: updateProduct,
		onSuccess: () => {
			client.invalidateQueries();
			toast.success('Product updated');
			open = false;
		}
	});

	const form = superForm(defaults(zod(updateProductSchema)), {
		SPA: true,
		validators: zodClient(updateProductSchema),
		id: `edit-product-form-${product.id}`,
		resetForm: false,
		onUpdate({ form }) {
			if (form.valid) {
				$updateProductMutation.mutate({
					id: product.id,
					product: form.data
				});
			}
		}
	});

	const { form: formData, enhance } = form;

	$effect(() => {
		if (product) {
			$formData = {
				id: product.id,
				name: product.name,
				description: product.description,
				categories: product.categories ?? []
			};
		}
	});
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => (open = true)}
	class="relative size-8 w-full p-0"
>
	Edit
</Button>

<Dialog.Root bind:open>
	<Dialog.Content class="max-h-screen w-full max-w-2xl overflow-y-auto p-4 ">
		<Dialog.Header>
			<Dialog.Title class="text-center">Edit Product</Dialog.Title>
			<Dialog.Description class="text-center">
				<p>{product.name}</p>
			</Dialog.Description>
		</Dialog.Header>

		<ScrollArea class="h-full w-full">
			<form method="POST" use:enhance>
				<div class="grid grid-cols-2 gap-4 px-4">
					<Form.Field {form} class="col-span-2" name="name">
						<Form.Control>
							<Form.Label>Name</Form.Label>
							<Input type="text" bind:value={$formData.name} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} class="col-span-2" name="description">
						<Form.Control>
							<Form.Label>Description</Form.Label>
							<Textarea bind:value={$formData.description} />
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>

					<Form.Field {form} name="categories">
						<Form.Control>
							<Form.Label>Category</Form.Label>
							<Dropdown
								placeholder="Select Categories"
								bind:selectedValue={$formData.categories}
								options={categoryNames}
							/>
						</Form.Control>
						<Form.FieldErrors />
					</Form.Field>
				</div>

				<Dialog.Footer class="flex  justify-between px-4">
					<Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
					<Button
						onclick={() => form.submit()}
						disabled={$updateProductMutation.isPending || $updateProductMutation.isPaused}
					>
						{#if $updateProductMutation.isPending || $updateProductMutation.isPaused}
							<LoaderIcon class="mr-1 h-4 w-4 animate-spin" />
						{/if}
						Save
					</Button>
				</Dialog.Footer>
			</form>
		</ScrollArea>
	</Dialog.Content>
</Dialog.Root>
