<script lang="ts">
	import { Header } from '$lib/components/header';
	export let data;
</script>

<Header title={data.headerTitle} />

<slot />
