import type { FoundItem, FoundItemsResponse, FoundItemsParams, ItemCategory } from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(`API error ${status}: ${message}`);
		this.status = status;
	}
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
	});

	if (!res.ok) {
		const body = await res.text();
		let message: string;
		try {
			message = JSON.parse(body).message ?? body;
		} catch {
			message = body;
		}
		throw new ApiError(res.status, message);
	}

	return res.json();
}

export function getFoundItems(params: FoundItemsParams = {}): Promise<FoundItemsResponse> {
	const searchParams = new URLSearchParams();
	if (params.status) searchParams.set("status", params.status);
	if (params.category) searchParams.set("category", params.category);
	if (params.search) searchParams.set("search", params.search);
	if (params.page) searchParams.set("page", String(params.page));
	if (params.limit) searchParams.set("limit", String(params.limit));

	return apiFetch<FoundItemsResponse>(`/found-items?${searchParams.toString()}`);
}

export function getFoundItem(id: string): Promise<FoundItem> {
	return apiFetch<FoundItem>(`/found-items/${id}`);
}

export function getCategories(): Promise<ItemCategory[]> {
	return apiFetch<{ data: ItemCategory[] }>("/categories").then((res) => res.data);
}
