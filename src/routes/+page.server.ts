import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import { DB_URL } from '$env/static/private';

export const prerender = true;

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	// const secret = process.env;
	const examples = await prisma.example.findMany();

	return {
		examples
	};
};
