// import {pageLoad} from "$types"
import type { PageLoad } from './$types';
// import 'dotenv/config';

export const prerender = true;

export const load: PageLoad = async ({ data }) => {
	// const secret = process.env;

	return data;
};
