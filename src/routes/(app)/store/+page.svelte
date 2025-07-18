<script lang="ts">
	import { Plus } from 'lucide-svelte';

	import * as Tabs from '$lib/components/ui/tabs';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { DashboardHeader } from '$lib/components/header';
</script>

<DashboardHeader
	description="Take full control of your store's design and vibe with our intuitive, powerful store builder."
	heading="Your Store"
	backHref="/settings"
/>

<Tabs.Root value="store">
	<div class="w-full">
		<Tabs.List>
			<Tabs.Trigger value="store">Store</Tabs.Trigger>
			<Tabs.Trigger value="blog-posts">Blog posts</Tabs.Trigger>
		</Tabs.List>
	</div>

	<Tabs.Content value="store">
		<Card.Root>
			<Card.Content class="space-y-2">
				<div class="flex flex-col items-center space-y-2 text-center">
					<Button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
						href="/store/create-store"
					>
						<Plus class="h-4 w-4" />
					</Button>

					<h1 class="text-xl">Create Store</h1>
					<p class=" pb-4 text-sm text-gray-700">
						Set Up Your Online Store and Start Selling Today
					</p>

					<Button href="/store/create-store">Create</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>

	<Tabs.Content value="blog-posts">
		<Card.Root>
			<Card.Content class="space-y-2">
				<div class="flex flex-col items-center space-y-2 text-center">
					<Button
						class="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 p-0 text-gray-700 hover:bg-gray-300"
						href="/store/add-new-blog-post"
					>
						<Plus class="h-4 w-4" />
					</Button>

					<h1 class="text-xl">Add Blog Post</h1>
					<p class=" pb-4 text-sm text-gray-700">
						Start Creating a New Blog Post to Share Your Insights and Expertise
					</p>

					<Button href="/store/add-new-blog-post">Add Blog Post</Button>
				</div>
			</Card.Content>
		</Card.Root>
	</Tabs.Content>
</Tabs.Root>
