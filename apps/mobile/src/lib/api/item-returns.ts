import { apiFetch } from "./client";
import type { ItemReturn } from "../types";

export function returnItem(
	itemId: string,
	observation?: string,
): Promise<ItemReturn> {
	return apiFetch<ItemReturn>("/item-returns", {
		method: "POST",
		body: JSON.stringify({ itemId, observation }),
	});
}