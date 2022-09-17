<script lang="ts">
	import type { Clickable } from '$lib/types';
	import { onDestroy } from 'svelte';

	export let parent: Clickable | null = null;

	let oldParent: Clickable | null = null;

	let animate: boolean = false;

	$: onParentChange(parent);

	function onParentChange(parent: Clickable | null) {
		if (oldParent) {
			oldParent.removeEventListener('click', onClick);
		}
		if (parent) {
			parent.addEventListener('click', onClick);
		}
		oldParent = parent;
	}

	function onClick() {
		animate = false;

		setTimeout(() => {
			animate = true;
		});
	}

	onDestroy(() => {
		if (parent) {
			parent.removeEventListener('click', onClick);
		}
	});
</script>

<div class:animate on:animationend={() => (animate = false)} aria-hidden="true" />

<style lang="scss">
	@keyframes animate {
		0% {
			scale: 0.6;
			opacity: 1;
		}
		100% {
			scale: 1.4;
			opacity: 0;
		}
	}

	div {
		pointer-events: none;

		position: absolute;
		z-index: 10000;
		inset: 0;
		opacity: 0;

		border-radius: 50%;

		background-color: hsl(210 75% 70% / 0.5);

		&.animate {
			animation: animate 400ms ease-out forwards;
		}
	}
</style>
