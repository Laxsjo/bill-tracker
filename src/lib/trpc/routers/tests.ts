import { z } from 'zod';
import * as trpc from '@trpc/server';

export default trpc.router().query('randomNumber', {
	input: z.object({ min: z.number().min(0), max: z.number().max(500) }),

	resolve({ input }) {
		console.log('generated random number');
		return Math.random() * (input.max - input.min) + input.min;
	},
});
