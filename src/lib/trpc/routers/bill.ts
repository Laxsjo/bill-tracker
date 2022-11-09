import { MINDEE_API_KEY } from '$env/static/private';
import * as trpc from '@trpc/server';
import { createRouter } from '$lib/trpc/factories';
import { Client, ReceiptResponse } from 'mindee/dist';
import { z } from 'zod';
import fs from 'fs';
import os from 'os';
import {
	convertAmountField,
	convertDateField,
	convertField,
	type Field,
} from '$lib/utilities/mindee';
import { db } from '$lib/database';
import _ from 'lodash';

export default createRouter()
	.mutation('parseReceipt', {
		input: z.object({ documentBytes: z.string(), filename: z.string() }),
		async resolve({ input }): Promise<{
			filename: string;
			amount: Field<number>;
			date: Field<string>;
			time: Field<string>;
			merchantName: Field<string>;
			category: Field<string>;
		}> {
			const client = new Client({ apiKey: MINDEE_API_KEY });

			const tmpPath = os.tmpdir() + `/${input.filename}`;

			fs.writeFileSync(tmpPath, input.documentBytes, { encoding: 'binary' });

			console.log('Document: ', input.documentBytes.slice(0, 500));
			const reqDoc = client.docFromPath(tmpPath);
			console.log('parsing document at', tmpPath);

			const response = await reqDoc.parse(ReceiptResponse);
			console.log('Finished parsing');

			if (response.document === undefined) {
				throw new trpc.TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: "Mindee api didn't return document",
				});
			}
			const resDoc = response.document;

			// console.log(resDoc);

			return {
				filename: input.filename,
				amount: convertAmountField(resDoc.totalIncl),
				date: convertDateField(resDoc.date),
				time: convertField(resDoc.time, /^([0-1][0-9]|2[0-4]):([0-5][0-9])$/),
				merchantName: convertField(resDoc.merchantName),
				category: convertField(resDoc.category),
			};
		},
	})
	.mutation('upload', {
		input: z.object({
			image: z.object({
				binary: z.string(),
				filename: z.string().min(0).max(20),
			}),
			fields: z.object({
				amount: z.number(),
				date: z.string().regex(/^[0-9]{4}-(0[0-9]|1[0-2])-([0-2][0-9]|3[0-1])$/, {
					message: "Must be valid 'yyyy-mm-dd' date format",
				}),
				time: z.string().regex(/^([0-1][0-9]|2[0-4]):([0-5][0-9])$/, {
					message: "Must be valid 'hh:ss' date format",
				}),
				merchantName: z.string().max(30).optional(),
				category: z.string().max(30).optional(),
			}),
		}),
		async resolve({ ctx, input: { image, fields } }) {
			console.log('Uploading...');

			const userId = ctx.userId;

			if (userId === undefined) {
				throw new trpc.TRPCError({ code: 'FORBIDDEN', message: 'Not logged in' });
			}

			fields.date;

			const date = new Date(fields.date);

			const timeParts = fields.time.split(':');
			const hours = Number(timeParts[0]);
			const seconds = Number(timeParts[1]);

			date.setHours(hours, seconds);

			const imageBuffer = Buffer.from(image.binary, 'binary');
			const cacheBuffer = Buffer.from('', 'binary'); // Temporary while i figure out image processing on the server.

			console.log('Creating receipt: ', {
				user: {
					connect: { id: userId },
				},
				amount: fields.amount,
				timestamp: date,
				merchantName: fields.merchantName,
				category: fields.category,
				image: {
					create: {
						data: imageBuffer,
						cachedData: cacheBuffer,
						filename: image.filename,
						width: 0,
						height: 0,
						uploaderId: userId,
					},
				},
			});

			const receipt = await db.receipt.create({
				data: {
					// userId: userId,
					user: {
						connect: { id: userId },
					},
					amount: fields.amount,
					timestamp: date,
					merchantName: fields.merchantName,
					category: fields.category,
					image: {
						create: {
							data: imageBuffer,
							cachedData: cacheBuffer,
							filename: image.filename,
							// Also temporary, see comment above
							width: 0,
							height: 0,
							uploaderId: userId,
						},
					},
				},
				include: {
					image: true,
				},
			});

			console.log('Receipt generated:', receipt);

			return { receiptId: receipt.id };
		},
	})
	.mutation('test', {
		input: z.object({ string: z.string() }),
		async resolve({ input }) {
			console.log('db.tests:', db.tests);
			console.log('db keys:', _.keysIn(db));

			const field = await db.tests.create({
				data: { field: input.string },
			});

			return field;
		},
	});
