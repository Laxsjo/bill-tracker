<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.scss';
	import '$lib/styles/definitions.scss';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import type { LayoutServerData } from './$types';
	import { loggedIn } from '$lib/stores';
	import { onMount } from 'svelte';
	import * as pages from '$lib/pages';
	import { page } from '$app/stores';

	export let data: LayoutServerData;

	loggedIn.set(data.userId !== undefined);

	beforeNavigate((navigation) => {
		console.log(data);

		loggedIn.set(data.userId !== undefined);

		if (data.userId === undefined) {
			const allowedPaths = ['login', 'register'];
			if (navigation.to && !allowedPaths.includes(navigation.to.routeId ?? '')) {
				navigation.cancel();
			}
		}
	});

	afterNavigate((navigation) => {
		console.log('CurrentPage:', pages.getCurrent($page.routeId ?? ''));
	});

	onMount(() => {
		console.log('CurrentPage:', pages.getCurrent($page.routeId ?? ''));
	});
</script>

<Header />

<main>
	<slot />
</main>

<footer>
	<p>visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to learn SvelteKit</p>
</footer>

<style>
	main {
		flex: 1;
		/* display: flex; */
		/* flex-direction: column; */
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
