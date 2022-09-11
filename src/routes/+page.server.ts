import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

export const prerender = true;

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
	const examples = await prisma.example.findMany();

	return {
		examples
	};
};
