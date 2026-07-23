export type ItemStatus = "disponivel" | "devolvido";

export interface ItemCategory {
	id: string;
	name: string;
	slug: string;
	createdAt: string;
}

export interface ItemReturn {
	id: string;
	itemId: string;
	returnedAt: string;
	observation: string | null;
	createdAt: string;
}

export interface FoundItem {
	id: string;
	title: string;
	description: string | null;
	categoryId: string;
	category?: ItemCategory;
	status: ItemStatus;
	itemReturn?: ItemReturn | null;
	photoUrl: string;
	foundLocationText: string;
	foundLatitude: number | null;
	foundLongitude: number | null;
	foundAt: string;
	createdAt: string;
	updatedAt: string;
}

export interface FoundItemsResponse {
	data: FoundItem[];
	meta?: { total: number; page: number; limit: number };
}

export interface FoundItemsParams {
	status?: string;
	category?: string;
	search?: string;
	page?: number;
	limit?: number;
}

export interface CategoriesResponse {
	data: ItemCategory[];
	meta: { total: number; page: number; limit: number };
}
