import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/client";
import { foundItemsKeys } from "@/lib/api/found-items.queries";

export type ItemCounts = {
	disponivel: number;
	devolvido: number;
};

function getCounts(): Promise<ItemCounts> {
	return apiFetch<ItemCounts>("/found-items/counts");
}

export function useItemCounts() {
	return useQuery<ItemCounts>({
		queryKey: foundItemsKeys.counts(),
		queryFn: getCounts,
		staleTime: 30_000,
		refetchInterval: 30_000,
	});
}
