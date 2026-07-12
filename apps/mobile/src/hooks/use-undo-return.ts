import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { deleteItemReturn } from "@/lib/api/item-returns";
import { NetworkError } from "@/lib/api/client";

export function useUndoReturn() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemReturnId: string) => deleteItemReturn(itemReturnId),
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
