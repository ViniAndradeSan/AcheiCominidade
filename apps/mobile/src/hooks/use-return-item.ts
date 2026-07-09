import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { returnItem } from "@/lib/api/item-returns";

export function useReturnItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: returnItem,

		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: foundItemsKeys.all,
			});
		},
	});
}
