import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { NetworkError } from "@/lib/api/client";
import { updateFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { uploadImageToR2 } from "@/lib/upload/upload-image";
import type { CreateFoundItemInput } from "@/lib/types";

export function useUpdateFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (params: {
			id: string;
			input: Partial<CreateFoundItemInput>;
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
			return updateFoundItem(params.id, payload);
		},

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: foundItemsKeys.all,
			});
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
