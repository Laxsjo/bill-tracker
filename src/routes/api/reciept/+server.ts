import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { MINDEE_API_KEY } from '$env/static/private';
// import { Client, InvoiceResponse } from 'bcrypt';

async function getBase64(file: File) {
	return URL.createObjectURL(file);

	// return new Promise<string | ArrayBuffer | null>((resolve, reject) => {

	// 	const reader = new FileReader();
	// 	reader.readAsDataURL(file);
	// 	reader.onload = () => resolve(reader.result);
	// 	reader.onerror = (error) => reject(error);
	// });
}

export const POST: RequestHandler = async (event) => {
	if (!event.request.headers.get('content-type')?.includes('multipart/form-data')) {
		throw error(400, "Expected content-type to be 'multipart/form-data'");
	}
	// if (!event.request.headers.get('content-type')?.includes('application/json')) {
	// 	throw error(400, "Expected content-type to be 'application/json'");
	// }
	const data = await event.request.formData();

	const image = data.get('image');
	if (image === null) {
		throw error(400, "'image' field required");
	}
	if (typeof image !== 'string') {
		throw error(400, "'image' should be an base64 encoded image string");
	}

	// const formData = new FormData();
	// formData.set('document', image, image.name);

	// const base64 = await getBase64(image);
	// if (typeof base64 !== 'string') {
	// 	throw error(500, 'internal type error');
	// }

	const mindeeData = {
		document: image,
	};

	// const t = Array.from(formData.entries());
	// console.log('sent:', t);
	const response = await fetch(
		'https://api.mindee.net/v1/products/mindee/expense_receipts/v3/predict',
		{
			method: 'POST',
			headers: {
				// 'Content-Type': 'multipart/form-data',
				'Content-Type': 'application/json',
				Authorization: `Token ${MINDEE_API_KEY}`,
			},
			body: JSON.stringify(mindeeData),
		}
	);

	const respData = await response.json();
	console.log(respData);

	return new Response(JSON.stringify(respData), {
		headers: { 'Content-Type': 'application/json' },
	});

	// throw error(500, 'not implemented');
};
