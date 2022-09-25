import { invalid, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as bcrypt from 'bcrypt';
import { db } from '$lib/database';
// import { unpackFormData } from '$lib/utilities/form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
// import Joi from 'joi';

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		// const data = await request.formData();

		const schema = zfd.formData({
			username: zfd.text(
				z
					.string()
					.regex(/[a-z0-9_]+/i)
					.min(3)
					.max(20)
			),
			password: zfd.text(),
		});
		// type Schema = z.infer<typeof schema>;

		// const schema = Joi.object<Schema>({
		// 	username: Joi.string()
		// 		.regex(/[a-z0-9_]+/i)
		// 		.min(3)
		// 		.max(20)
		// 		.required(),
		// 	password: Joi.string().required(),
		// });

		try {
			const data = schema.parse(await request.formData());
			// const data: Schema = Joi.attempt(unpackFormData(await request.formData()), schema);

			let user;
			try {
				user = await db.user.findUnique({ where: { username: data.username } });
			} catch (e) {
				return invalid(500, { error: 'Database failure' });
			}
			const passwordMatches = user && (await bcrypt.compare(data.password, user.passwordHash));

			if (!user || !passwordMatches) {
				return invalid(400, { error: 'Invalid username or password given' });
			}

			const token = crypto.randomUUID();
			console.log('Set token to:', token);

			await db.user.update({
				where: {
					id: user.id,
				},
				data: {
					userAuthToken: token,
				},
			});

			const days100 = 100 * 24 * 60 * 60;
			cookies.set('session', token, {
				maxAge: days100,
				httpOnly: false,
				sameSite: 'strict',
				secure: false,
			});
		} catch (e) {
			// if (e instanceof Joi.ValidationError) {
			if (e instanceof z.ZodError) {
				console.log(e);
				return invalid(400, { error: e.message });
			}
			throw e;
		}

		throw redirect(303, '/');
	},
};
