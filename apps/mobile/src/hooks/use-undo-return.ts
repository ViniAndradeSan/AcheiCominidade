import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import { deleteItemReturn } from "@/lib/api/item-returns";

export function useUndoReturn() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (itemReturnId: string) =>
			deleteItemReturn(itemReturnId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: foundItemsKeys.all,
			});
		},
	});
}
