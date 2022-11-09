import type * as mindeeFields from 'mindee/dist/src/fields';
import * as trpc from '@trpc/server';
import { toDateString } from '$lib/utilities/formating';

export type Field<Type extends string | number> = {
	value: Type | undefined;
	confidence: number;
};

export function convertField(field: mindeeFields.Field, regex?: RegExp): Field<string> {
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
export function convertAmountField(field: mindeeFields.Amount): Field<number> {
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
export function convertDateField(field: mindeeFields.DateField): Field<string> {
	const value = field.dateObject && toDateString(field.dateObject);

	return {
		confidence: field.confidence,
		value: value,
	};
}
