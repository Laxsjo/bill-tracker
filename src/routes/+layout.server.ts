import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (event) => {
	return { userId: event.locals.userId };
};
