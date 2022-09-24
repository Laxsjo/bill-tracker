import type { inferAsyncReturnType } from '@trpc/server';
import tests from './routers/tests';
import bill from './routers/bill';
import * as trpc from '@trpc/server';
import { z } from 'zod';

export const router = trpc.router().merge('tests:', tests).merge('bill:', bill);

export type Router = typeof router;
