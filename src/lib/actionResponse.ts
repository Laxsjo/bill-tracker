import _ from 'lodash';

export type InvResponseType = 'missing' | 'type' | 'value' | 'format' | 'id';

type MaybeArray<T, Condition extends boolean> = Condition extends true ? T[] : T;

export type InvResponse<T extends InvResponseType, Multiple extends boolean> = {
	readonly type: T;
	readonly params: MaybeArray<string, Multiple>;
	readonly values?: MaybeArray<FormDataEntryValue | null, Multiple>;
	readonly message?: string;
};

export type InvMissingResponse<Multiple extends boolean> = InvResponse<'missing', Multiple> & {
	readonly values: undefined;
	readonly message: undefined;
};

export type InvTypeResponse<Multiple extends boolean> = InvResponse<'type', Multiple> & {
	readonly values: MaybeArray<FormDataEntryValue | null, Multiple>;
	readonly message: undefined;
	readonly expectedTypes: MaybeArray<string, Multiple>;
};

export type InvValueResponse<Multiple extends boolean> = InvResponse<'value', Multiple> & {
	readonly values: MaybeArray<FormDataEntryValue | null, Multiple>;
	readonly message: string;
};

export type InvFormatResponse<Multiple extends boolean> = InvResponse<'format', Multiple> & {
	readonly values: MaybeArray<FormDataEntryValue | null, Multiple>;
	readonly message: string;
};

export type InvIdResponse<Multiple extends boolean> = InvResponse<'id', Multiple> & {
	readonly values: MaybeArray<FormDataEntryValue | null, Multiple>;
	readonly message: undefined;
};

export function invalidMissing(param: string): InvMissingResponse<false>;
export function invalidMissing(params: string[]): InvMissingResponse<true>;
/**
 * Generate invalid _missing_ parameter response object
 *
 * This should be returned when **params** weren't submitted with the request.
 *
 * When given multiple parameters, the response object only states that _any_
 * of the given parameters were invalid.
 *
 * @param params
 * @returns
 */
export function invalidMissing<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>
): InvMissingResponse<Multiple> {
	return {
		type: 'missing',
		params,
		values: undefined,
		message: undefined,
	};
}

export function invalidType(
	param: string,
	value: FormDataEntryValue | null,
	type: string
): InvTypeResponse<false>;
export function invalidType(
	params: string[],
	values: (FormDataEntryValue | null)[],
	types: string[]
): InvTypeResponse<true>;
/**
 * Generate invalid parameter _type_ response object
 *
 * This should be returned when **params** couldn't be converted to excpected **types**.
 *
 * When given multiple parameters, the response object only states that _any_
 * of the given parameters were invalid.
 *
 * @param params
 * @param values
 * @param types
 * @returns
 */
export function invalidType<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<FormDataEntryValue | null, Multiple>,
	types: MaybeArray<string, Multiple>
): InvTypeResponse<Multiple> {
	return {
		type: 'type',
		params,
		values,
		message: undefined,
		expectedTypes: types,
	};
}

export function invalidValue(
	param: string,
	value: FormDataEntryValue | null,
	message: string
): InvValueResponse<false>;
export function invalidValue(
	params: string[],
	values: (FormDataEntryValue | null)[],
	message: string
): InvValueResponse<true>;
/**
 * Generate invalid parameter _value_ response object
 *
 * This should be returned when the **values** of **params** aren't valid,
 * e.g. when a number is to large.
 * The constraints of the value should be specified in **messages**.
 *
 * When given multiple parameters, the response object only states that _any_
 * of the given parameters were invalid.
 *
 * @param params
 * @param values
 * @param message
 * @returns
 */
export function invalidValue<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<FormDataEntryValue | null, Multiple>,
	message: string
): InvValueResponse<Multiple> {
	return {
		type: 'value',
		params,
		values,
		message,
	};
}

export function invalidFormat(
	param: string,
	value: FormDataEntryValue | null,
	message: string
): InvFormatResponse<false>;
export function invalidFormat(
	params: string[],
	values: (FormDataEntryValue | null)[],
	message: string
): InvFormatResponse<true>;
/**
 * Generate invalid parameter _format_ response object
 *
 * This should be returned when the **values** of **params** doesn't follow any
 * valid format, such as an incorrect email address.
 * The format of the value should be specified in **messages**.
 *
 * When given multiple parameters, the response object only states that _any_
 * of the given parameters were invalid.
 *
 * @param params
 * @param values
 * @param message
 * @returns
 */
export function invalidFormat<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<FormDataEntryValue | null, Multiple>,
	message: string
): InvFormatResponse<Multiple> {
	return {
		type: 'format',
		params,
		values,
		message,
	};
}

export function invalidId(param: string, value: FormDataEntryValue | null): InvIdResponse<false>;
export function invalidId(
	params: string[],
	values: (FormDataEntryValue | null)[]
): InvIdResponse<true>;
/**
 * Generate invalid parameter with _non-existent id_ response object
 *
 * This should be returned when the value of the given parameter points to a
 * non-existant reference, such as an when given a username that doesn't
 * exist.
 *
 * When given multiple parameters, the response object only states that _any_
 * of the given parameters were invalid.
 *
 * @param params
 * @param values
 * @returns
 */
export function invalidId<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<FormDataEntryValue | null, Multiple>
): InvIdResponse<Multiple> {
	return {
		type: 'id',
		params,
		values,
		message: undefined,
	};
}

function generateUIOrList(items: string[]): string {
	if (items.length > 1) {
		items = [..._.initial(items), 'or', ..._.takeRight(items, 1)];
		items = [..._.map(_.dropRight(items, 2), (param) => `${param},`), ..._.takeRight(items, 2)];
	}
	return items.join(' ');
}

export function generateResponseUIText<T extends InvResponseType, M extends boolean>(
	response: InvResponse<T, M>
): string {
	let param = response.params as string[] | string;

	switch (response.type) {
		case 'value':
			if (_.isArray(param)) {
				param = generateUIOrList(param);
				return `${param} are not ${response.message}`;
			}

			return `${param} is not ${response.message}`;
		case 'format':
			if (_.isArray(param)) {
				param = generateUIOrList(param);
				return `${param} are not ${response.message}`;
			}

			return `${param} is not ${response.message}`;
		case 'id':
			if (_.isArray(param)) {
				param = generateUIOrList(param);
				return `invalid value for ${param}`;
			}

			return `invalid value for ${param}`;

		case 'missing':
		case 'type':
		default:
			break;
	}
	return 'An error occurred';
}
