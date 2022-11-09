<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import HighlightLink from '$lib/components/HighlightLink.svelte';

	export let data: PageData;

	let env = import.meta.env;

	onMount(() => {
		console.log('Env:', env, 'Row:', data.examples);
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Bill Tracker</h1>
	<p>It tracks your bills!</p>
	<HighlightLink url="/bills/new">Add New</HighlightLink>
	<Counter />
</section>
<section>
	<h2>Example database row</h2>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	h1 {
		width: 100%;
	}
</style>
