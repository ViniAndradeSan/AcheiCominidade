import { apiFetch } from "./client";

export interface GeocodingSuggestion {
	displayName: string;
	latitude: number;
	longitude: number;
}

export async function searchAddresses(
	query: string,
): Promise<GeocodingSuggestion[]> {
	if (!query.trim()) return [];
	return apiFetch<GeocodingSuggestion[]>(
		`/geocoding/search?q=${encodeURIComponent(query)}&limit=5`,
	);
}
