import { useQuery } from "@tanstack/react-query";

import { foundItemsKeys, getFoundItem } from "@/lib/api/found-items.queries";

export function useFoundItem(id: string | undefined) {
	return useQuery({
		queryKey: foundItemsKeys.detail(id as string),
		queryFn: () => getFoundItem(id as string),
		enabled: Boolean(id),
	});
}
