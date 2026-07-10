import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";

export function useDeleteFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: string) => deleteFoundItem(id),

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: foundItemsKeys.all,
			});
		},
	});
}