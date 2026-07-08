import { apiFetch } from "./client";
import type { ItemCategory } from "../types";

export function getCategories(): Promise<ItemCategory[]> {
	return apiFetch<ItemCategory[]>("/categories");
}