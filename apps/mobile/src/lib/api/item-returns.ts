import type { ItemReturn } from "../types";
import { apiFetch } from "./client";

export interface ReturnItemInput {
	itemId: string;
	observation?: string;
}

export function returnItem({
	itemId,
	observation,
}: ReturnItemInput): Promise<ItemReturn> {
	return apiFetch<ItemReturn>("/item-returns", {
		method: "POST",
		body: JSON.stringify({
			itemId,
			observation,
		}),
	});
}
