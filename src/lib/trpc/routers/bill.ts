import { z } from 'zod';
import * as trpc from '@trpc/server';
import { Client, ReceiptResponse } from 'mindee/dist';
import type * as mindeeFields from 'mindee/dist/src/fields';
import { MINDEE_API_KEY } from '$env/static/private';
import fs from 'fs';
import os from 'os';
import { toDateString } from '$lib/utilities/formating';

type Field<Type extends string | number> = {
	value: Type | undefined;
	confidence: number;
};

export default trpc
	.router()
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

			function convertField(field: mindeeFields.Field, regex?: RegExp): Field<string> {
				const value = field.value as unknown;
				if ((typeof value !== 'string' || !(regex?.test(value) ?? true)) && value !== undefined) {
					throw new trpc.TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Mindee api returned wrong type',
					});
				}

				return {
					confidence: field.confidence,
					value: value,
				};
			}
			function convertAmountField(field: mindeeFields.Amount): Field<number> {
				const value = field.value as unknown;
				if (typeof value !== 'number' && value !== undefined) {
					throw new trpc.TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'Mindee api returned wrong type',
					});
				}

				return {
					confidence: field.confidence,
					value: value,
				};
			}
			function convertDateField(field: mindeeFields.DateField): Field<string> {
				const value = field.dateObject && toDateString(field.dateObject);

				return {
					confidence: field.confidence,
					value: value,
				};
			}

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
		input: z.object({}),
		async resolve({ input }) {
			console.log('Uploaded!');
		},
	});
