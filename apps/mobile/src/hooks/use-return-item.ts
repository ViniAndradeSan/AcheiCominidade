// apps/mobile/src/hooks/use-return-item.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import type { ReturnItemInput } from "@/lib/api/item-returns";
import { returnItem } from "@/lib/api/item-returns";

export function useReturnItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: ReturnItemInput) => returnItem(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: foundItemsKeys.all });
		},
	});
}
