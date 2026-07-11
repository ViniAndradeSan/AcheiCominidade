import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFoundItem } from "@/lib/api/found-items.mutations";
import { foundItemsKeys } from "@/lib/api/found-items.queries";
import type { CreateFoundItemInput } from "@/lib/types";

export function useCreateFoundItem() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (input: CreateFoundItemInput) => createFoundItem(input),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: foundItemsKeys.all });
		},
	});
}
