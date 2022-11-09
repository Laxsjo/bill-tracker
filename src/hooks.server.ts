import { db } from '$lib/database';
import type { Handle } from '@sveltejs/kit';
import { createTRPCHandle } from 'trpc-sveltekit';
import { router } from '$lib/trpc/server';
import { createContext } from '$lib/trpc/factories';
// import * as cookie from 'cookie';

export const handle: Handle = async ({ event, resolve }) => {
	const session = event.cookies.get('session') ?? '';

	const user = await db.user.findUnique({ where: { userAuthToken: session } });
	if (user === null) {
		const allowedPaths = ['login', 'register'];
		if (!allowedPaths.includes(event.routeId ?? '')) {
			return new Response('Redirect', {
				status: 303,
				headers: { Location: '/login' },
			});
		}
	} else {
		event.locals.userId = user.id;
	}

	const response = await createTRPCHandle({
		url: '/trpc',
		createContext,
		router,
		event,
		resolve,
	});

	return response;
	// return await resolve(event);
};
