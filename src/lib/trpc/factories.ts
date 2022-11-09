import * as trpc from '@trpc/server';
import type { RequestEvent } from '@sveltejs/kit';

export function createContext(event: RequestEvent) {
	return event.locals;
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export function createRouter() {
	return trpc.router<Context>();
}
