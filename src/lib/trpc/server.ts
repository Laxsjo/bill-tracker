import tests from './routers/tests';
import bill from './routers/bill';
import {} from 'trpc-sveltekit';
import { z, type InnerTypeOfFunction } from 'zod';
import { createRouter } from './factories';
export { type Context } from './factories';

export const router = createRouter().merge('tests:', tests).merge('bill:', bill);

export type Router = typeof router;
