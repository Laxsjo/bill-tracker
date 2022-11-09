import _ from 'lodash';
import type { DeepRecord } from '../types';

/**
 * Adapted from https://stackoverflow.com/a/36490174/15507414
 *
 * @param obj
 * @param parentKey
 * @returns
 */
function pathPart(
	obj: DeepRecord<string | number, unknown> | unknown,
	parentKey: string
): string[] {
	let result: string[];

	if (_.isArray(obj)) {
		let idx = 0;
		result = _.flatMap(obj, function (obj) {
			return pathPart(obj, (parentKey || '') + '[' + idx++ + ']');
		});
	} else if (_.isObject(obj)) {
		result = _.flatMap(_.keys(obj), function (key) {
			return _.map(pathPart((obj as Record<string, unknown>)[key], key), function (subkey) {
				return (parentKey ? parentKey + '.' : '') + subkey;
			});
		});
	} else {
		result = [];
	}
	return _.concat(result, parentKey || []);
}

/**
 * Get all paths on object recursively that lead to leafs
 *
 * @param obj The object to get paths from
 * @returns
 */
export function paths(obj: DeepRecord<string, unknown>): string[] {
	return pathPart(obj, '');
}

export function mapDeep<T, TResult>(
	obj: DeepRecord<string, T>,
	iteratee: (value: T, path: string, object: DeepRecord<string, T>) => TResult
): DeepRecord<string, TResult> {
	const result = _.cloneDeep(obj);

	for (const prop of paths(obj)) {
		_.update(obj, prop, _.partialRight(iteratee, prop, obj));
	}
	// _.map

	return result as DeepRecord<string, TResult>;
}
