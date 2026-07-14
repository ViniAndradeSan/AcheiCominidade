import * as Location from "expo-location";
import { useState } from "react";

export type LocationResult = {
	latitude: number | null;
	longitude: number | null;
	addressText: string | null;
	loading: boolean;
	error: string | null;
};

export function useLocation() {
	const [state, setState] = useState<LocationResult>({
		latitude: null,
		longitude: null,
		addressText: null,
		loading: false,
		error: null,
	});

	async function captureCurrentLocation(): Promise<string | null> {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		const permission = await Location.requestForegroundPermissionsAsync();

		if (permission.status !== "granted") {
			setState({
				latitude: null,
				longitude: null,
				addressText: null,
				loading: false,
				error:
					"Não foi possível acessar sua localização, digite o local manualmente.",
			});
			return null;
		}

		try {
			const timeout = new Promise<never>((_, reject) =>
				setTimeout(() => reject(new Error("Tempo limite excedido")), 8000),
			);

			const location = (await Promise.race([
				Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.Balanced,
				}),
				timeout,
			])) as Location.LocationObject;

			const { latitude, longitude } = location.coords;

			let addressText: string | null = null;
			// Use Nominatim (OpenStreetMap) reverse geocoding to avoid a paid API key.
			// Nominatim public endpoints are rate-limited and require a sensible
			// `User-Agent`/`Referer`. This provides a free reverse-geocoding
			// alternative when `Location.reverseGeocodeAsync` is not available.
			try {
				const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
					latitude,
				)}&lon=${encodeURIComponent(longitude)}`;
				const res = await fetch(url, {
					headers: {
						// Include a minimal user agent / referer per Nominatim policy.
						Referer: "achei-comunidade",
					},
				});
				if (res.ok) {
					const data = await res.json();
					// Prefer `display_name` returned by Nominatim, fallback to building
					// a short representation if necessary.
					if (data?.display_name) {
						addressText = String(data.display_name);
					} else if (data?.address) {
						const addr = data.address;
						const parts = [
							addr.road || addr.pedestrian,
							addr.house_number,
							addr.suburb || addr.neighbourhood,
							addr.city || addr.town || addr.village,
							addr.state,
						].filter(Boolean);
						addressText = parts.join(", ") || null;
					}
				}
			} catch {
				// geocoding failed — provide a fallback using coordinates so callers
				// still get a human-readable value to populate the location field.
				if (typeof latitude === "number" && typeof longitude === "number") {
					addressText = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
				}
			}

			setState({
				latitude,
				longitude,
				addressText,
				loading: false,
				error: null,
			});

			return addressText;
		} catch {
			setState({
				latitude: null,
				longitude: null,
				addressText: null,
				loading: false,
				error:
					"Não foi possível acessar sua localização, digite o local manualmente.",
			});
			return null;
		}
	}

	return { ...state, captureCurrentLocation };
}
