<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import { paths } from '$lib/utilities/basic';

	export let data: PageData;
	$: console.log('data:', data);

	onMount(() => {
		const t = {
			a: 5,
			b: {
				c: 'hi',
				d: [
					1,
					2,
					{
						e: 69,
						f: 'hello',
					},
				],
			},
		};
		console.log(paths(t));
	});
</script>

<h1>Your Receipts</h1>
