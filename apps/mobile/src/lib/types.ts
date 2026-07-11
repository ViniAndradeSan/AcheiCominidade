export type ItemStatus = "disponivel" | "devolvido";

export interface ItemCategory {
	id: string;
	name: string;
	slug: string;
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

export interface CreateFoundItemInput {
	title: string;
	description?: string;
	categoryId: string;
	photoUrl: string;
	foundLocationText: string;
	foundLatitude?: number;
	foundLongitude?: number;
}

export interface ItemReturn {
	id: string;
	itemId: string;
	returnedAt: string;
	observation: string | null;
	createdAt: string;
}
