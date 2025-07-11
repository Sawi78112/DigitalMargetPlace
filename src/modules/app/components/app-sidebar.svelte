<script lang="ts">
	import { BookOpen, Settings } from 'lucide-svelte';

	import { links } from '..';

	import { getCurrentUser, urlRedirectForLoggedInUser } from '$modules/auth';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import * as Sidebar from '$lib/components/ui/sidebar';

	const { user } = getCurrentUser();
	const currentPath = $derived(page.url.pathname);
</script>

<Sidebar.Root
	class="mt-4 ml-4 flex h-[calc(100vh-32px)] w-[240px] flex-col justify-between rounded-md bg-white py-4"
>
	<Sidebar.Header class="mb-8">
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					onclick={() => goto(urlRedirectForLoggedInUser(user))}
					isActive={true}
					class="text-muted-foreground flex h-10 items-center justify-center text-xl"
				>
					LOGO
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>

	<Sidebar.Content class="flex-1 overflow-y-auto px-2">
		<Sidebar.Group>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="space-y-1">
					{#each links as link (link.title)}
						<Sidebar.MenuItem>
							<Sidebar.MenuButton
								isActive={currentPath.startsWith(link.url)}
								class="flex items-center gap-3 rounded-full px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
							>
								{#snippet child({ props })}
									<a href={link.url} {...props}>
										<link.icon class="h-5 w-5" />
										<span>{link.title}</span>
									</a>
								{/snippet}
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>

	<Sidebar.Footer class="px-2 pb-4">
		<Sidebar.Menu class="space-y-1">
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					isActive={currentPath.startsWith('/settings')}
					class="flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
				>
					<a href="/settings" class="flex w-full items-center gap-3">
						<Settings class="h-5 w-5" />
						<span>Settings</span>
					</a>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton
					class="flex items-center gap-3 rounded-md px-4 py-2 text-sm transition-colors hover:bg-blue-50 hover:text-blue-600 data-[active=true]:bg-blue-50 data-[active=true]:text-blue-600"
				>
					<a href="/help" class="flex w-full items-center gap-3">
						<BookOpen class="h-5 w-5" />
						<span>Help</span>
					</a>
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Footer>
</Sidebar.Root>
