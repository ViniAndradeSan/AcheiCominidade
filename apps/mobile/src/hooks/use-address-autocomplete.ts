import { useQuery } from "@tanstack/react-query";
import {
	searchAddresses,
	type GeocodingSuggestion,
} from "@/lib/api/geocoding";

export type { GeocodingSuggestion };

export function useAddressAutocomplete(query: string) {
	const trimmed = query.trim();

	return useQuery<GeocodingSuggestion[]>({
		queryKey: ["geocoding", "search", trimmed],
		queryFn: () => searchAddresses(trimmed),
		enabled: trimmed.length >= 3,
		staleTime: 60_000,
		placeholderData: (prev) => prev,
	});
}
