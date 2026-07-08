import { apiFetch } from "./client";
import type { ItemCategory } from "../types";

interface CategoriesResponse {
	data: ItemCategory[];
	meta: { total: number; page: number; limit: number };
}

export function getCategories(): Promise<ItemCategory[]> {
	return apiFetch<CategoriesResponse>("/categories").then((r) => r.data);
}