import { invalid } from '@sveltejs/kit';
import type { Actions } from './$types';
import { invalidFormat, invalidId, invalidMissing, invalidType } from '$lib/actionResponse';
import * as bcrypt from 'bcrypt';
import * as Joi from 'joi';

import { db } from '$lib/database';
import { unpackFormData } from '$lib/formUtils';

export const actions: Actions = {
	default: async ({ request }) => {
		type Schema = {
			username: string;
			password: string;
		};
		const schema = Joi.object<Schema>({
			username: Joi.string()
				.regex(/[a-z0-9_]+/i)
				.min(3)
				.max(20)
				.required(),
			password: Joi.string().min(10).max(50).required(),
		});
		try {
			const data: Schema = Joi.attempt(unpackFormData(await request.formData()), schema);

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
			if (e instanceof Joi.ValidationError) {
				console.log(e);
				return invalid(400, { error: e.message });
			}
			return invalid(500, { error: e });
		}
	},
};

// export const POST: RequestHandler = async ({ request }) => {
// 	const form = await request.formData();
// 	const username = form.get('username');
// 	const password = form.get('password');

// 	if (typeof username !== 'string' || typeof password !== 'string') {
// 		return new Response({error: 'Something went horribly wrong.'}, {}) {
// 			status: 500,
// 			body: {
// 				error: 'Something went horribly wrong.'
// 			}
// 		};
// 	}

// 	if (!username || !password) {
// 		return {
// 			status: 400,
// 			body: {
// 				error: 'Username and password is required.'
// 			}
// 		};
// 	}

// 	try {
// 		await db.user.create({
// 			data: {
// 				username,
// 				passwordHash: await bcrypt.hash(password, 10)
// 			}
// 		});

// 		return {
// 			status: 200,
// 			body: { success: 'Success.' }
// 		};
// 	} catch (error) {
// 		return {
// 			status: 400,
// 			body: {
// 				error: 'User already exists.'
// 			}
// 		};
// 	}
// };
