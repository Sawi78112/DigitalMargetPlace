<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Plus } from 'lucide-svelte';
</script>

<Tabs.Root value="products">
	<Tabs.List class="grid w-full grid-cols-3">
		<Tabs.Trigger value="products">Products</Tabs.Trigger>
		<Tabs.Trigger value="collaborators">Collaborators</Tabs.Trigger>
		<Tabs.Trigger value="reviews">Reviews</Tabs.Trigger>
	</Tabs.List>

	<Tabs.Content value="products">
		<Card.Root>
			<Card.Content class="space-y-2">
				<div class="flex flex-col items-center space-y-2 text-center">
					<Button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
						href="/products/add"
					>
						<Plus class="h-4 w-4" />
					</Button>

					<h1 class="text-xl">Add Products</h1>
					<p class=" pb-4 text-sm text-gray-700">
						Turn your creativity into profit by adding and selling your digital products
						effortlessly.
					</p>

					<Button href="/products/add">Add Products</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="collaborators">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-gray-700"></Card.Title>
			</Card.Header>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="reviews">
		<Card.Root>
			<Card.Header>
				<Card.Title class="text-gray-700"></Card.Title>
			</Card.Header>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
