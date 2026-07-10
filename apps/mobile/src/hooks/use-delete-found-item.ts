import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { deleteFoundItem } from "@/lib/api/found-items.mutations";
import type { FoundItem } from "@/lib/types";

export function useDeleteFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFoundItem(id),
		onMutate: async (id) => {
			await queryClient.cancelQueries({ queryKey: foundItemsKeys.all });
			const previous = queryClient.getQueriesData({ queryKey: foundItemsKeys.all });

			queryClient.setQueriesData<FoundItem[]>(
				{ queryKey: foundItemsKeys.all },
				(old) => (Array.isArray(old) ? old.filter((item) => item.id !== id) : old),
			);

			return { previous };
		},
		onError: (_err, _id, context) => {
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
