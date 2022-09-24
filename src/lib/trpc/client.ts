import type { Router } from './server';
import * as trpc from '@trpc/client';

export default trpc.createTRPCClient<Router>({ url: '/trpc' });
