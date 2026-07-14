import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { NetworkError } from "@/lib/api/client";
import { updateFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import type { CreateFoundItemInput } from "@/lib/types";

export function useUpdateFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({
			id,
			input,
		}: {
			id: string;
			input: Partial<CreateFoundItemInput>;
		}) => updateFoundItem(id, input),

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
