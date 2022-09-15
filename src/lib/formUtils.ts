import * as _ from 'lodash';

type FormJSON =
	| { [key: string]: FormDataEntryValue | FormJSON }
	| Array<FormDataEntryValue | FormJSON>;

export function unpackFormData(data: FormData): FormJSON {
	const result: FormJSON = {};

	const entries = data.entries();

	for (const [key, value] of entries) {
		_.set(result, key, value);
	}

	return result;
}
