import { browser } from '$app/environment';
import type { PageServerLoad } from './$types';
import { TEST } from '$env/static/private';

export const prerender = true;

export const load: PageServerLoad = async () => {
	// const secret = process.env;

	return {
		secretEnv: TEST
	};
};
