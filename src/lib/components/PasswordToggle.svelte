<script lang="ts">
	import type { EasingFunction, TransitionConfig } from 'svelte/transition';
	import { quadInOut } from 'svelte/easing';
	import EyeOutline from 'svelte-material-icons/EyeOutline.svelte';
	import EyeOffOutline from 'svelte-material-icons/EyeOffOutline.svelte';
	import { lerp } from '$lib/util';
	import ClickHighlight from './ClickHighlight.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { func } from 'joi';

	export let name: string = '';
	export let id: string = '';

	export let value: string = '';

	let input: HTMLInputElement;

	let button: HTMLButtonElement;

	$: if (name === '') {
		name = id;
	}

	let shown = false;

	function handleClick() {
		shown = !shown;
	}

	function handleInput() {
		value = input.value;
	}

	interface diagonalRevealConfig {
		delay?: number;
		duration?: number;
		easing?: EasingFunction;
		out?: boolean;
		reversed?: boolean;
	}
	function diagonalReveal(_node: Element, params?: diagonalRevealConfig): TransitionConfig {
		if (!params) params = {};
		return {
			delay: params.delay || 0,
			duration: params.duration || 200,
			easing: params.easing || quadInOut,
			css: (t, u) => {
				const reverse = params?.reversed || false;
				if (reverse) {
					return `
						clip-path: polygon(
							${lerp(150, 50, u)}% ${lerp(50, -50, u)}%,
							50% -50%,
							-50% 51%,
							${lerp(50, -50, u)}% ${lerp(150, 50, u)}%
						)
						`;
				} else {
					return `
						clip-path: polygon(
							${lerp(150, 50, t)}% ${lerp(50, -50, t)}%,
							150% 50%,
							50% 151%,
							${lerp(50, -50, t)}% ${lerp(150, 50, t)}%
						)
						`;
				}
			},
		};
	}

	let form: HTMLFormElement | null;
	function handleSubmit() {
		shown = false;
	}

	onMount(() => {
		form = input.form;
		if (form) {
			form.addEventListener('submit', handleSubmit);
		}
	});

	onDestroy(() => {
		if (form) {
			form.removeEventListener('submit', handleSubmit);
		}
	});
</script>

<div>
	<input
		type={shown ? 'text' : 'password'}
		{name}
		{id}
		{value}
		bind:this={input}
		on:input={handleInput}
	/>
	<button on:click={handleClick} bind:this={button} type="button">
		{#if shown}
			<span class="first" transition:diagonalReveal={{ reversed: true }}>
				<EyeOutline />
			</span>
		{:else}
			<span class="second" transition:diagonalReveal={{ reversed: false }}>
				<EyeOffOutline />
			</span>
		{/if}
		<ClickHighlight parent={button} />
	</button>
</div>

<style lang="scss">
	@use '../../lib/styles/mixins' as m;
	div {
		display: flex;
		align-items: center;
	}

	button {
		display: inline-grid;
		place-items: center;
		position: relative;

		padding: 0.2em;

		border-radius: 50%;

		background-color: hsl(210 10% 25%);
		@include m.Clickable();

		&:hover,
		&:focus-visible {
			background-color: hsl(210 10% 35%);
		}

		&:active {
			background-color: hsl(210 15% 20%);
		}
	}
	button span {
		width: 1em;
		height: 1em;
		display: block;
		grid-area: 1 / 1;
		/* grid-column: 1;
		grid-row: 1; */
		/* background-color: coral; */
	}

	// span.first {
	// 	background-color: hsl(16 100% 66% / 0.5);
	// 	color: black;
	// 	// grid-row: 1;
	// }
	// span.second {
	// 	background-color: hsl(210 100% 56% / 0.5);
	// 	color: goldenrod;

	// 	// grid-row: 3;
	// }
</style>
