<script lang="ts">
	import trpcClient from '$lib/trpc/client';

	let form: HTMLFormElement;

	let input: HTMLInputElement;

	let min = 0;
	let max = 1;
	let randomNumber: number | null = null;
	let error: string | null = null;

	// async function getBase64(file: File) {
	// 	// return URL.createObjectURL(file);

	// 	return new Promise<string>((resolve, reject) => {
	// 		const reader = new FileReader();
	// 		reader.readAsDataURL(file);
	// 		reader.onload = () => {
	// 			// I'm pretty sure result can only be a string at this point.
	// 			const b64 = (reader.result as string).replace(/^data:.+;base64,/, ''); // replace data uri prefix (from here: https://stackoverflow.com/a/53632803/15507414)
	// 			resolve(b64);
	// 		};
	// 		reader.onerror = (error) => reject(error);
	// 	});
	// }

	async function getBinaryString(file: File) {
		// return URL.createObjectURL(file);

		return new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsBinaryString(file);
			reader.onload = () => {
				// I'm pretty sure result can only be a string at this point.
				resolve(reader.result as string);
			};
			reader.onerror = (error) => reject(error);
		});
	}

	async function submit() {
		const file = input.files?.[0];
		if (!file) {
			error = 'No image selected!';
			throw new Error(error);
		}
		let bytes: string;
		try {
			bytes = await getBinaryString(file);
		} catch (error) {
			error = 'error';
			throw new Error('Failed converting to base64');
		}
		const res = await trpcClient.mutation('bill:parseReceipt', {
			documentBytes: bytes,
			filename: file.name,
		});

		console.log(res);
	}

	async function getRandom() {
		randomNumber = await trpcClient.query('tests:randomNumber', { min, max });
	}
</script>

<form action="/api/reciept" method="post" bind:this={form}>
	<input
		type="file"
		name="image"
		id="image"
		accept="image/*"
		capture="environment"
		bind:this={input}
	/>
	<button type="button" on:click={submit}>Submit</button>
</form>

<hr />
<div>
	<div>
		<label>Min: <input type="number" name="min" id="min" bind:value={min} /></label>
	</div>
	<div>
		<label>Max: <input type="number" name="max" id="max" bind:value={max} /></label>
	</div>

	<div>
		<button on:click={getRandom}>Generate random number</button>
	</div>
	{#if randomNumber !== null}
		<div>Your random number: {randomNumber}</div>
	{/if}
	{#if error !== null}
		<div>Error: {error}</div>
	{/if}
</div>
