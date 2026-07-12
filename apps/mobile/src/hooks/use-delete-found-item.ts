import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";
import { deleteFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { NetworkError } from "@/lib/api/client";
import type { FoundItem } from "@/lib/types";

export function useDeleteFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFoundItem(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: foundItemsKeys.all });
			const previous = queryClient.getQueriesData({
				queryKey: foundItemsKeys.all,
			});

			queryClient.setQueriesData<FoundItem[]>(
				{ queryKey: foundItemsKeys.all },
				(old) =>
					Array.isArray(old) ? old.filter((item) => item.id !== id) : old,
			);

			return { previous };
		},
		onError: (err: unknown, _id, context) => {
			if (err instanceof NetworkError) {
				Alert.alert(
					"Sem conexão",
					"Não foi possível salvar. Verifique sua internet e tente novamente.",
				);
			}

			if (context?.previous) {
				for (const [key, data] of context.previous) {
					queryClient.setQueryData(key, data);
				}
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: foundItemsKeys.all });
		},
	});
}
