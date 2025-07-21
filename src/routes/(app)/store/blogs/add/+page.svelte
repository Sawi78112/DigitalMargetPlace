<script lang="ts">
	import { DashboardHeader } from '$lib/components/header';
	import { NewBlogForm } from '$modules/blog/blog-form';
</script>

<DashboardHeader
	heading="Add new blog post"
	description="To get choose your blog post title then add the content"
	backHref="/store"
/>

<div class="space-y-5">
	<div class="flex items-center justify-between">
		<NewBlogForm />
	</div>
</div>
