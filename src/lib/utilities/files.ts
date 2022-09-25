export async function readAsBinaryString(file: File) {
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
export async function readAsDataUrl(file: File) {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			// I'm pretty sure result can only be a string at this point.
			resolve(reader.result as string);
		};
		reader.onerror = (error) => reject(error);
	});
}
