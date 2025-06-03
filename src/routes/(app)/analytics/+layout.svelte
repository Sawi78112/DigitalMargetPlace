<script lang="ts">
	import { Header } from '$lib/components/header';

	let { data, children } = $props();
</script>

<Header title={data.headerTitle} />

{@render children?.()}
