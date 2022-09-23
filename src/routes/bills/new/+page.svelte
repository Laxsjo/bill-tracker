<script lang="ts">
	import { base } from '$app/paths';

	let form: HTMLFormElement;

	let input: HTMLInputElement;

	async function getBase64(file: File) {
		// return URL.createObjectURL(file);

		return new Promise<string | undefined>((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result?.toString());
			reader.onerror = (error) => reject(error);
		});
	}

	async function submit() {
		const data = new FormData();
		const file = input.files?.[0];
		if (!file) {
			throw new Error('No image selected');
		}
		const base64 = await getBase64(file);
		if (base64 === undefined) {
			throw new Error('Failed converting to base64');
		}

		data.set('image', base64);
		const resp = await fetch(form.action, {
			method: form.method,
			body: data,
		});

		console.log(await resp.json());
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
