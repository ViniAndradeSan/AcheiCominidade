import * as ImagePicker from "expo-image-picker";
import { useState } from "react";

export type PickedImage = {
	uri: string;
	mimeType: string | null;
};

export function useImagePicker() {
	const [image, setImage] = useState<PickedImage | null>(null);
	const [error, setError] = useState<string | null>(null);

	async function pickFromCamera(): Promise<void> {
		setError(null);

		const permission = await ImagePicker.requestCameraPermissionsAsync();

		if (!permission.granted) {
			setError("Precisamos da câmera pra registrar o item");
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			quality: 0.5,
			base64: false,
		});

		if (result.canceled) return;

		const asset = result.assets[0];
		setImage({ uri: asset.uri, mimeType: asset.mimeType ?? null });
	}

	async function pickFromGallery(): Promise<void> {
		setError(null);

		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permission.granted) {
			setError("Precisamos da galeria pra selecionar uma foto");
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			quality: 0.5,
			base64: false,
		});

		if (result.canceled) return;

		const asset = result.assets[0];
		setImage({ uri: asset.uri, mimeType: asset.mimeType ?? null });
	}

	function clear(): void {
		setImage(null);
		setError(null);
	}

	return { image, error, pickFromCamera, pickFromGallery, clear };
}
