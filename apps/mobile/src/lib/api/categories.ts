import type { ItemCategory } from "../types";
import { apiFetch } from "./client";

interface CategoriesResponse {
	data: ItemCategory[];
	meta: { total: number; page: number; limit: number };
}

export function getCategories(): Promise<ItemCategory[]> {
	return apiFetch<CategoriesResponse>("/categories").then((r) => r.data);
}
