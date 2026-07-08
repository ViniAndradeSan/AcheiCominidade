import { apiFetch } from "./client";
import type { FoundItem, ItemStatus } from "../types";

export interface GetFoundItemsParams {
	status?: ItemStatus;
	categoryId?: string;
	search?: string;
}

interface FoundItemsResponse {
	data: FoundItem[];
	meta: { total: number; page: number; limit: number };
}

function buildQueryString(params?: GetFoundItemsParams): string {
	if (!params) return "";

	const query = new URLSearchParams();

	if (params.status) query.set("status", params.status);
	if (params.categoryId) query.set("categoryId", params.categoryId);
	if (params.search) query.set("search", params.search);

	const queryString = query.toString();
	return queryString ? `?${queryString}` : "";
}

export function getFoundItems(
	params?: GetFoundItemsParams,
): Promise<FoundItem[]> {
	return apiFetch<FoundItemsResponse>(
		`/found-items${buildQueryString(params)}`,
	).then((r) => r.data);
}

// item único não é paginado, continua igual
export function getFoundItem(id: string): Promise<FoundItem> {
	return apiFetch<FoundItem>(`/found-items/${id}`);
}