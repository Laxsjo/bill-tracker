<script lang="ts">
	import { fly } from 'svelte/transition';

	let show = false;
</script>

<button
	on:click={() => {
		show = !show;
	}}
>
	Toggle!
</button>

<div>
	{#if show}
		<span class="a" transition:fly={{ duration: 1000, x: 100 }}>A</span>
		<span class="b" transition:fly={{ duration: 1000, x: -100 }}>B</span>
	{/if}
</div>

<style>
	div {
		display: grid;
		grid-template-rows: repeat(2, 3rem);
	}
	span {
		font-size: 3em;
	}
	.a {
		grid-row: 1;
	}
	.b {
		grid-row: 2;
	}
</style>
