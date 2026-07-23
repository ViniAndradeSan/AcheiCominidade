import { useQuery } from "@tanstack/react-query";
import { getFoundItems, getFoundItem, getCategories } from "../lib/api";
import type { FoundItemsResponse, FoundItemsParams } from "../types";

export const foundItemsKeys = {
	all: ["found-items"] as const,
	list: (params: FoundItemsParams) => [...foundItemsKeys.all, "list", params] as const,
	detail: (id: string) => [...foundItemsKeys.all, "detail", id] as const,
};

export const categoriesKeys = {
	all: ["categories"] as const,
	list: () => [...categoriesKeys.all, "list"] as const,
};

export function useFoundItems(params: FoundItemsParams = {}) {
	return useQuery({
		queryKey: foundItemsKeys.list(params),
		queryFn: () => getFoundItems(params),
		placeholderData: (previous) => previous,
	});
}

export function useFoundItem(id: string) {
	return useQuery({
		queryKey: foundItemsKeys.detail(id),
		queryFn: () => getFoundItem(id),
		enabled: !!id,
	});
}

export function useCategories() {
	return useQuery({
		queryKey: categoriesKeys.list(),
		queryFn: getCategories,
		staleTime: 5 * 60 * 1000,
	});
}
