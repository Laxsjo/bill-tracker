import type { Router } from './server';
import * as trpc from '@trpc/client';
import type { inferAsyncReturnType } from '@trpc/server';

const client = trpc.createTRPCClient<Router>({ url: '/trpc' });
export default client;

export type QueryReturnType<MethodName extends keyof Router['_def']['queries']> =
	inferAsyncReturnType<typeof client.query<Router['_def']['queries'], MethodName>>;
export type MutationReturnType<MethodName extends keyof Router['_def']['mutations']> =
	inferAsyncReturnType<typeof client.mutation<Router['_def']['mutations'], MethodName>>;
