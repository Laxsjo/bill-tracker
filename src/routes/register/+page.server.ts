import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as bcrypt from 'bcrypt';
// import Joi from 'joi';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { db } from '$lib/database';
// import { unpackFormData } from '$lib/utilities/form';

export const actions: Actions = {
	default: async ({ request }) => {
		const schema = zfd.formData({
			username: zfd.text(
				z
					.string()
					.regex(/[z-z0-9_]+/i)
					.min(3)
					.max(20)
			),
			password: zfd.text(z.string().min(10).max(50)),
		});
		// type Schema = {
		// 	username: string;
		// 	password: string;
		// };
		// const schema = Joi.object<Schema>({
		// 	username: Joi.string()
		// 		.regex(/[a-z0-9_]+/i)
		// 		.min(3)
		// 		.max(20)
		// 		.required(),
		// 	password: Joi.string().min(10).max(50).required(),
		// });
		try {
			// const data: Schema = Joi.attempt(unpackFormData(await request.formData()), schema);
			const data = schema.parse(await request.formData());

			const passwordHash = await bcrypt.hash(data.password, 10);

			// !Temporary while developing, as there's currently no way to delete users.
			db.user.delete({ where: { username: data.username } });

			try {
				await db.user.create({
					data: {
						username: data.username,
						passwordHash,
					},
				});
			} catch (e) {
				return invalid(400, { error: 'Username already exits' });
			}

			return { success: true };
		} catch (e) {
			// if (e instanceof Joi.ValidationError) {
			if (e instanceof z.ZodError) {
				console.log(e);
				return invalid(400, { error: e.message });
			}
			return invalid(500, { error: e });
		}
	},
};
