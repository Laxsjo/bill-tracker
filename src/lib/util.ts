// From here: https://gist.github.com/demonixis/4202528?permalink_comment_id=2077938#gistcomment-2077938
export function lerp(a: number, b: number, t: number) {
	return (1 - t) * a + t * b;
}
