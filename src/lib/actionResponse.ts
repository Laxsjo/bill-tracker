export type InvResponseType = 'missing' | 'type' | 'value' | 'format' | 'id';

type MaybeArray<T, Condition extends boolean> = Condition extends true ? T[] : T;

interface InvResponse<T extends InvResponseType, Multiple extends boolean> {
	type: T;
	params: MaybeArray<string, Multiple>;
	values?: MaybeArray<string, Multiple>;
	messages?: MaybeArray<string, Multiple>;
}

interface InvMissingResponse<Multiple extends boolean> extends InvResponse<'missing', Multiple> {
	values: undefined;
	messages: undefined;
}

interface InvTypeResponse<Multiple extends boolean> extends InvResponse<'type', Multiple> {
	values: MaybeArray<string, Multiple>;
	messages: undefined;
	expectedTypes: MaybeArray<string, Multiple>;
}

interface InvValueResponse<Multiple extends boolean> extends InvResponse<'value', Multiple> {
	values: MaybeArray<string, Multiple>;
	messages: MaybeArray<string, Multiple>;
}

interface InvFormatResponse<Multiple extends boolean> extends InvResponse<'format', Multiple> {
	values: MaybeArray<string, Multiple>;
	messages: MaybeArray<string, Multiple>;
}

interface InvIdResponse<Multiple extends boolean> extends InvResponse<'id', Multiple> {
	values: MaybeArray<string, Multiple>;
	messages: undefined;
}

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
		messages: undefined
	};
}

export function invalidType(param: string, value: string, type: string): InvTypeResponse<false>;
export function invalidType(
	params: string[],
	values: string[],
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
	values: MaybeArray<string, Multiple>,
	types: MaybeArray<string, Multiple>
): InvTypeResponse<Multiple> {
	return {
		type: 'type',
		params,
		values,
		messages: undefined,
		expectedTypes: types
	};
}

export function invalidValue(
	param: string,
	value: string,
	message: string
): InvValueResponse<false>;
export function invalidValue(
	params: string[],
	values: string[],
	messages: string[]
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
 * @param messages
 * @returns
 */
export function invalidValue<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<string, Multiple>,
	messages: MaybeArray<string, Multiple>
): InvValueResponse<Multiple> {
	return {
		type: 'value',
		params,
		values,
		messages
	};
}

export function invalidFormat(
	param: string,
	value: string,
	message: string
): InvFormatResponse<false>;
export function invalidFormat(
	params: string[],
	values: string[],
	messages: string[]
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
 * @param messages
 * @returns
 */
export function invalidFormat<Multiple extends boolean>(
	params: MaybeArray<string, Multiple>,
	values: MaybeArray<string, Multiple>,
	messages: MaybeArray<string, Multiple>
): InvFormatResponse<Multiple> {
	return {
		type: 'format',
		params,
		values,
		messages
	};
}

export function invalidId(param: string, value: string): InvIdResponse<false>;
export function invalidId(params: string[], values: string[]): InvIdResponse<true>;
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
	values: MaybeArray<string, Multiple>
): InvIdResponse<Multiple> {
	return {
		type: 'id',
		params,
		values,
		messages: undefined
	};
}
