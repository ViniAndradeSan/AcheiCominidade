import { keepPreviousData, useQuery } from "@tanstack/react-query";

import type { FoundItem } from "@/lib/types";
import {
	foundItemsKeys,
	type GetFoundItemsParams,
	getFoundItems,
} from "@/lib/api/found-items.queries";

export function useFoundItems(filters: GetFoundItemsParams = {}) {
	return useQuery<FoundItem[]>({
		queryKey: foundItemsKeys.list(filters),
		queryFn: () => getFoundItems(filters),
		placeholderData: keepPreviousData,
	});
}
