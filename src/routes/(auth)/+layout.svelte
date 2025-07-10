<script lang="ts">
	const { children } = $props();
</script>

<div
	class="relative flex h-screen items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
>
	<div class="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
		<div class="absolute inset-0 bg-[url('/img/dmp-bg.jpg')] bg-cover bg-right bg-no-repeat"></div>
	</div>

	<div class="flex h-full w-full flex-col items-center justify-center px-8">
		<div class="w-full max-w-md">
			{@render children()}
		</div>
	</div>
</div>
