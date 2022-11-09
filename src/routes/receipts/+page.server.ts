import type { PageServerLoad } from './$types';

import { db } from '$lib/database';
import { mapDeep } from '$lib/utilities/basic';
import _ from 'lodash';
import type { DeepRecord } from '$lib/types';

// export const prerender = true;

export const load: PageServerLoad = async (event) => {
	if (event.locals.userId === undefined) {
		return [];
	}

	const receipts = await db.receipt.findMany({
		where: { userId: event.locals.userId },
		include: {
			image: true,
		},
	});

	console.log(receipts);

	type test = {
		a: string;
		b: string;
	} & {
		other: string;
	};

	const a: DeepRecord<string, number> = {
		a: 0,
		b: {
			c: {
				d: 0,
			},
			e: 0,
		},
	};

	// function test<T>(obj: DeepRecord<K, T>): Record<string, T>{
	// 	return obj as any;
	// }
	// _.isPlainObject()

	// const t = _.map(receipts, (receipt) => {
	// 	const a: test = true as any;
	// 	test(a)
	// 	return mapDeep(receipt, (value) => {
	// 		console.log(value);
	// 		return 69;

	// 	})
	// })
	// 	// mapDeep(receipts, (value) => {

	// // });

	return;
	return {};
};
