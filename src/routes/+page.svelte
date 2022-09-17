<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

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
	<h1>
		<span class="welcome">
			<picture>
				<source srcset="svelte-welcome.webp" type="image/webp" />
				<img src="svelte-welcome.png" alt="Welcome" />
			</picture>
		</span>

		to your new<br />SvelteKit app
	</h1>

	<h2>
		try editing <strong>src/routes/+page.svelte</strong>
	</h2>

	<Counter />
</section>
<section>
	<h2>Example database row</h2>

	<table>
		<thead>
			<tr>
				<td>exampleId</td>
				<td>text</td>
				<td>numbers</td>
			</tr>
		</thead>
		<tbody>
			{#each data.examples as example}
				<tr>
					<td>{example.exampleId}</td>
					<td>{example.text}</td>
					<td>{JSON.stringify(example.numbers)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
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

	.welcome {
		display: block;
		position: relative;
		width: 100%;
		height: 0;
		padding: 0 0 calc(100% * 495 / 2048) 0;
	}

	.welcome img {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		display: block;
	}

	table,
	table td {
		border: 1px solid var(--heading-color);
		border-collapse: collapse;
	}
</style>
