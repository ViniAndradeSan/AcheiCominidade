import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { NetworkError } from "@/lib/api/client";
import { createFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { uploadImageToR2 } from "@/lib/upload/upload-image";
import type { CreateFoundItemInput } from "@/lib/types";

export function useCreateFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			input: CreateFoundItemInput;
			imageUri?: string;
			imageMimeType?: string;
		}) => {
			let photoUrl = params.input.photoUrl;

			if (params.imageUri && params.imageMimeType) {
				photoUrl = await uploadImageToR2(
					params.imageUri,
					params.imageMimeType,
				);
			}

			const payload = { ...params.input, photoUrl };
			return createFoundItem(payload);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: foundItemsKeys.all });
		},
		onError: (err: unknown) => {
			if (err instanceof NetworkError) {
				Alert.alert(
					"Sem conexão",
					"Não foi possível salvar. Verifique sua internet e tente novamente.",
				);
			}
		},
	});
}
