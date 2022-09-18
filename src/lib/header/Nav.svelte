<script lang="ts">
	import { page } from '$app/stores';
	import { crossfade, fade } from 'svelte/transition';

	const [send, receive] = crossfade({
		fallback(node) {
			return fade(node, { duration: 200 });
		},
	});

	export let pages: {
		url: string;
		name: string;
	}[];

	// A constant id to be shared by all potential link markers
	let id = 1;
</script>

<nav>
	<ul>
		{#each pages as pageInfo (pageInfo.url)}
			<li class:active={$page.url.pathname === pageInfo.url}>
				<a href={pageInfo.url}>
					{pageInfo.name}
					{#if $page.url.pathname === pageInfo.url}
						<span
							in:receive={{ key: id }}
							out:send={{ key: id }}
							class="marker"
							aria-hidden="true"
						/>
					{/if}
				</a>
			</li>
		{/each}
	</ul>
</nav>

<style lang="scss">
	nav {
		display: contents;
	}

	ul {
		position: relative;
		padding: 0;
		margin: 0;
		height: 3em;
		display: flex;
		justify-content: center;
		align-items: center;
		list-style: none;
	}

	li {
		position: relative;
		height: 100%;

		&.active .marker {
			--size: 6px;
			content: '';
			width: 0;
			height: 0;
			position: absolute;
			top: 0;
			left: calc(50% - var(--size));
			border: var(--size) solid transparent;
			border-top: var(--size) solid var(--fc-main-accent-fg);
		}
	}

	a {
		display: flex;
		height: 100%;
		align-items: center;

		padding: 0 1em;

		font-weight: 700;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		text-decoration: none;

		color: var(--fc-header-fg);

		transition: color 0.2s linear;

		&:hover,
		&:focus-visible {
			color: var(--fc-main-accent-fg);
		}
	}
</style>
