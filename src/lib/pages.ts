// type Page<Subpages extends Record<string, Page> = Record<string, never>> = {
// 	name: string;
// 	uiName: string;
// 	url: string;
// 	t: keyof Subpages;
// 	[Subpagess in Subpages]: Page<Subpages>;
// }

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

const Pages = 'hi';
export default Pages;
