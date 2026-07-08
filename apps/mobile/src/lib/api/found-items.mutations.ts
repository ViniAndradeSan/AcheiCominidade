import { apiFetch } from "./client";
import type { CreateFoundItemInput, FoundItem } from "../types";

export function createFoundItem(
	input: CreateFoundItemInput,
): Promise<FoundItem> {
	return apiFetch<FoundItem>("/found-items", {
		method: "POST",
		body: JSON.stringify(input),
	});
}

export function updateFoundItem(
	id: string,
	input: Partial<CreateFoundItemInput>,
): Promise<FoundItem> {
	return apiFetch<FoundItem>(`/found-items/${id}`, {
		method: "PATCH",
		body: JSON.stringify(input),
	});
}

export function deleteFoundItem(id: string): Promise<void> {
	return apiFetch<void>(`/found-items/${id}`, {
		method: "DELETE",
	});
}