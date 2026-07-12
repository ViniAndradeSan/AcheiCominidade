// apps/mobile/src/hooks/use-return-item.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import type { ReturnItemInput } from "@/lib/api/item-returns";
import { returnItem } from "@/lib/api/item-returns";
import { NetworkError } from "@/lib/api/client";

export function useReturnItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: ReturnItemInput) => returnItem(input),
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
