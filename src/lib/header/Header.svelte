<script lang="ts">
	import LoginCircle from '$lib/components/LoginCircle.svelte';
	import Nav from './Nav.svelte';
</script>

<header>
	<a href="/">
		<div class="logo">Bill Tracker</div>
	</a>

	<div class="nav">
		<Nav
			pages={[
				{ url: '/', name: 'Home' },
				{ url: '/receipt/new', name: 'New' },
				{ url: '/about', name: 'About' },
				{ url: '/login', name: 'Login' },
				{ url: '/register', name: 'register' },
			]}
		/>
	</div>

	<div class="corner">
		<LoginCircle />
	</div>
</header>

<style lang="scss">
	header {
		display: flex;
		justify-content: space-between;
		align-items: stretch;

		padding-inline: var(--gap-700);

		border-bottom: 1px solid var(--fc-header-border);

		background-color: var(--fc-header-bg);

		a {
			display: contents;
		}
	}

	.nav {
		display: flex;
		justify-content: flex-end;

		flex-grow: 1;
	}

	.logo {
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--fc-logo-fg);
	}
</style>
