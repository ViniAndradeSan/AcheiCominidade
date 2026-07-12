import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
	foundItemsKeys,
	type GetFoundItemsParams,
	getFoundItems,
} from "@/lib/api/found-items.queries";
import type { FoundItem } from "@/lib/types";

export function useFoundItems(filters: GetFoundItemsParams = {}) {
	return useQuery<FoundItem[]>({
		queryKey: foundItemsKeys.list(filters),
		queryFn: () => getFoundItems(filters),
		placeholderData: keepPreviousData,
		staleTime: 15_000, // 15s — lista é multiusuário, dado muda com frequência
		refetchInterval: 30_000, // 30s polling leve enquanto a tela está em foco
		refetchIntervalInBackground: false, // pausa polling quando app sai de foco
	});
}
