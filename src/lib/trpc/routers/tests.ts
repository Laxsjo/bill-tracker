import { z } from 'zod';
import * as trpc from '@trpc/server';
import { createRouter } from '$lib/trpc/factories';

console.log(createRouter);

export default createRouter()
	.query('randomNumber', {
		input: z.object({ min: z.number().min(0), max: z.number().max(500) }),

		resolve({ input }) {
			console.log('generated random number');
			return Math.random() * (input.max - input.min) + input.min;
		},
	})
	.query('zod', {
		input: z.object({}),
		resolve({ input }) {
			const schema = z.object({
				a: z.string(),
				b: z.number(),
			});

			const obj1 = {
				a: 'hi',
				b: 5,
			};
			const obj2 = {
				a: 'hi',
				b: '6',
			};

			console.log(schema.safeParse(obj1));

			console.log(schema.safeParse(obj2));
		},
	});
