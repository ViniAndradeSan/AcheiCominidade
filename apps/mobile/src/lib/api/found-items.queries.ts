import type { FoundItem, ItemStatus } from "../types";
import { apiFetch } from "./client";

export interface GetFoundItemsParams {
	status?: ItemStatus;
	category?: string;
	search?: string;
}

function buildQueryString(params?: GetFoundItemsParams): string {
	if (!params) return "";

	const query = new URLSearchParams();

	if (params.status) query.set("status", params.status);
	if (params.category) query.set("category", params.category);
	if (params.search) query.set("search", params.search);

	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}

export function getFoundItems(
	params?: GetFoundItemsParams,
): Promise<FoundItem[]> {
	return apiFetch<FoundItem[]>(`/found-items${buildQueryString(params)}`);
}

// item único não é paginado, continua igual
export function getFoundItem(id: string): Promise<FoundItem> {
	return apiFetch<FoundItem>(`/found-items/${id}`);
}

export const foundItemsKeys = {
	all: ["found-items"] as const,

	list: (filters: GetFoundItemsParams = {}) =>
		[...foundItemsKeys.all, "list", filters] as const,

	detail: (id: string) => [...foundItemsKeys.all, "detail", id] as const,

	counts: () => [...foundItemsKeys.all, "counts"] as const,
};
