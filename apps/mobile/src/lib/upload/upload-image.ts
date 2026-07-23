import { getPresignedUploadUrl } from "@/lib/api/client";

export async function uploadImageToR2(
	uri: string,
	mimeType: string,
): Promise<string> {
	const filename = uri.split("/").pop() ?? `image.${mimeType.split("/")[1] ?? "jpg"}`;

	const { uploadUrl, publicUrl } = await getPresignedUploadUrl(
		filename,
		mimeType,
	);

	const response = await fetch(uri);
	const blob = await response.blob();

	const uploadResponse = await fetch(uploadUrl, {
		method: "PUT",
		body: blob,
		headers: {
			"Content-Type": mimeType,
		},
	});

	if (!uploadResponse.ok) {
		throw new Error(`Upload to R2 failed: ${uploadResponse.status}`);
	}

	return publicUrl;
}