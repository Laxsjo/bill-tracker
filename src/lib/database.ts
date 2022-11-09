// import prisma from '../../prisma/src/generated/client';
import prisma from '@prisma/client';

export const db = new prisma.PrismaClient();
