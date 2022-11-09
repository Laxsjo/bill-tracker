/* eslint-disable @typescript-eslint/no-namespace */
// type Page<Subpages extends Record<string, Page> = Record<string, never>> = {
// 	name: string;
// 	uiName: string;
// 	url: string;
// 	t: keyof Subpages;
// 	[Subpagess in Subpages]: Page<Subpages>;
// }

import _ from 'lodash';
import type { ValueOf } from './types';

// class Page {
// 	public name: string;

// 	public get url(): string {
// 		return this.urlOverride ?? this.name;
// 	}
// 	private urlOverride: string | null;

// 	public subpages: Record<string, Page>;

// 	public constructor(
// 		{ name, urlOverride }: { name: string; urlOverride?: string },
//         subpages?: Record<string, Page>
// 	) {
// 		this.name = name;
// 		this.urlOverride = urlOverride ?? null;

//         subpages = subpages ?? {};
// 	}
// }

type SinglePage = {
	name: string;
	urlFolder: string;
	url: string;
};

export type UnknownPage = SinglePage & {
	parent: UnknownPage | undefined;
};

export type Page<Parent extends Page<any> | undefined> = SinglePage & {
	parent: Parent;
};

function createPage<Parent extends Page<any> | undefined>(
	page: Omit<SinglePage, 'url'>,
	parent: Parent
): Page<Parent> {
	const finalPage = _.assign(page, { parent: parent });
	return _.assign(finalPage, { url: getUrl(finalPage) });
}

type PagesTree = { [names: string]: Page<any> & { children?: PagesTree } };

const rootPage = createPage({ name: 'Home', urlFolder: '' }, undefined);

const receipts = createPage({ name: 'Your Receipts', urlFolder: 'receipts' }, rootPage);
const receiptsNew = createPage({ name: 'Create New Receipt', urlFolder: 'new' }, receipts);

const about = createPage({ name: 'About', urlFolder: 'about' }, rootPage);

const login = createPage({ name: 'Login', urlFolder: 'login' }, rootPage);
const register = createPage({ name: 'Register', urlFolder: 'register' }, rootPage);

const allPages = [rootPage, receipts, receiptsNew, about, login, register];

export const root = {
	...rootPage,
	children: {
		receipts: {
			...receipts,
			children: {
				new: receiptsNew,
			},
		},
		about: about,
		login: login,
		register: register,
	},
};

export function getCurrent(urlPath: string): Page<any> | undefined {
	// console.log(`Searching for ${urlPath}...`);

	let searchObject: PagesTree | undefined = root.children;

	let foundPage: Page<any> | undefined = undefined;

	const searchParts = urlPath.split('/');
	if (searchParts.length === 1 && searchParts[0] === '') return root;
	let currentPart = searchParts[0];
	const foundParts: string[] = [];

	while (searchObject !== undefined && foundPage === undefined) {
		let foundName = false;
		_.forEach(searchObject, (value) => {
			// console.log(
			// 	'Checked',
			// 	value.urlFolder,
			// 	'against',
			// 	currentPart,
			// 	'; searchParts:',
			// 	searchParts
			// );

			if (value.urlFolder === currentPart) {
				foundParts.push(currentPart);
				if (foundParts.length === searchParts.length) {
					const tempObject = _.clone(value) as Omit<typeof value, 'children'>;
					_.unset(tempObject, 'children');
					foundPage = tempObject;
					foundName = true;
					return false;
				}

				currentPart = searchParts[foundParts.length];
				searchObject = value.children;
				foundName = true;
				return false;
			}
		});
		if (!foundName) {
			break;
		}
	}

	return foundPage;
}

export function getParentChain<T extends Omit<UnknownPage, 'url'>>(page: T): UnknownPage[] {
	let nextPage = page.parent;
	const pagesReverse: [T, ...UnknownPage[]] = [page];

	while (nextPage !== undefined) {
		pagesReverse.push(nextPage);
		nextPage = nextPage.parent;
	}

	return pagesReverse.reverse() as UnknownPage[]; // This is bad...
}

export function getUrl(page: Omit<UnknownPage, 'url'>): string {
	const parts = _.map(getParentChain(page), 'urlFolder');
	console.log('Joined', parts, 'into', parts.join('/'));

	return parts.join('/');
}
