<script lang="ts">
	import trpcClient from '$lib/trpc/client';
	import type { MutationReturnType } from '$lib/trpc/client';
	import { readAsBinaryString, readAsDataUrl } from '$lib/utilities/files';
	import _ from 'lodash';
	import type { InputType, PartialBy } from '$lib/types';
	import FieldInput from '$lib/components/FieldInput.svelte';

	type Parsed = Omit<MutationReturnType<'bill:parseReceipt'>, 'filename'>;
	type Values = {
		[P in keyof Parsed]: PartialBy<Parsed[P], 'confidence'> & {
			label: string;
			postfix?: string;
			type: InputType;
			optional?: boolean;
			component?: FieldInput;
		};
	};

	let files: FileList;
	let error: string | null = null;
	let parsed: Values = {
		amount: {
			value: 0,
			label: 'Amount',
			postfix: 'kr',
			type: 'number',
		},
		date: {
			value: '',
			label: 'Date',
			type: 'date',
		},
		time: {
			value: '',
			label: 'Time',
			type: 'time',
		},
		category: {
			value: '',
			label: 'Category',
			type: 'text',
			optional: true,
		},
		merchantName: {
			value: '',
			label: 'Merchant Name',
			type: 'text',
			optional: true,
		},
	};
	let components: Record<string, FieldInput> = {};
	let parsing = false;
	// $: console.log(parsed);
	// $: console.log(parsed.amount.value);

	let imageFile: File | undefined = undefined;
	let imageSrc = '/No-Image-Placeholder.png';
	let imageAlt = 'No image selected';

	async function parse() {
		const file = files?.[0];
		if (!file) {
			error = 'No image selected!';
			throw new Error(error);
		}

		parsing = true;
		error = null;

		// let bytes: string;
		// try {
		// 	bytes = await readAsBinaryString(file);
		// } catch (error) {
		// 	error = 'error';
		// 	throw new Error('Failed converting to base64');
		// }
		// const result = _.omit(
		// 	await trpcClient.mutation('bill:parseReceipt', {
		// 		documentBytes: bytes,
		// 		filename: file.name,
		// 	}),
		// 	'filename'
		// );
		// !Temporary while debuging
		const result = {
			amount: {
				confidence: 1,
				value: 387,
			},
			date: {
				confidence: 0.99,
				value: '2022-09-03',
			},
			time: {
				confidence: 0.99,
				value: '11:05',
			},
			merchantName: {
				confidence: 0.68,
				value: 'OFFICE DEPOT',
			},
			category: {
				confidence: 0.56,
				value: 'food',
			},
		};
		console.log(result);

		_.forIn(parsed, (value, key) => {
			if (!_.has(result, key)) return;

			_.assign(value, result[key as keyof typeof parsed]);
		});
		parsed = parsed;

		_.forIn(components, (component) => {
			component.revert();
		});

		imageFile = file;
		imageSrc = await readAsDataUrl(file);
		imageAlt = 'Your uploaded image';

		parsing = false;
	}

	async function upload() {
		let binary = '';
		let filename = '';
		if (imageFile) {
			filename = imageFile.name;
			binary = await readAsBinaryString(imageFile);
		}

		const fields = {
			amount: Number(parsed.amount.value),
			date: String(parsed.date.value),
			time: String(parsed.time.value),
			merchantName: parsed.merchantName.value,
			category: parsed.category.value,
		};

		const { receiptId } = await trpcClient.mutation('bill:upload', {
			image: {
				binary,
				filename,
			},
			fields,
		});

		console.log('Created receipt with id', receiptId);
	}

	let name = 'Hello, my name is string';

	async function test() {
		console.log('Sending request...');

		const result = await trpcClient.mutation('bill:test', { string: name });

		console.log('Result: ', result);
	}
</script>

<form class="parse">
	<input type="file" name="image" id="image" accept="image/*" capture="environment" bind:files />
	<button type="button" on:click={parse}>Load</button>

	{#if error !== null}
		<div class="error">Error: {error}</div>
	{/if}
</form>

<hr />

<form class="main" class:parsing>
	<div class="img">
		<img src={imageSrc} alt={imageAlt} />
	</div>
	<div class="inputs">
		{#each _.toPairs(parsed) as [name, field]}
			<FieldInput
				label={field.label}
				defaultValue={String(field.value)}
				postfix={field.postfix ?? null}
				confidence={field.confidence}
				type={field.type}
				optional={field.optional ?? false}
				bind:this={components[name]}
			/>
		{/each}
		<div>
			<button on:click={upload}>Save Receipt</button>
		</div>
	</div>
</form>

<hr />

<div>
	<input type="text" bind:value={name} />
</div>
<div>
	<button on:click={test}>Test upload</button>
</div>

<style lang="scss">
	.error {
		color: crimson;
	}
	.main {
		display: flex;
		flex-flow: row nowrap;
		justify-items: start;
		gap: var(--gap-700);
		position: relative;

		border-radius: var(--borderRadius-large);

		img {
			display: block;
			width: 15rem;

			border-radius: var(--borderRadius-medium);

			box-shadow: 0.2em 0.2em 0.2em var(--fc-shadow);
		}

		&::before {
			content: '';

			pointer-events: none;

			position: absolute;
			inset: 0;

			border-radius: inherit;

			background-color: transparent;

			transition: background-color ease 500ms;
		}

		&.parsing::before {
			background-color: var(--fc-inactive-overlay);
		}
	}

	.inputs {
		display: flex;
		flex-direction: column;
		gap: var(--gap-100);

		flex-grow: 1;
	}
</style>
