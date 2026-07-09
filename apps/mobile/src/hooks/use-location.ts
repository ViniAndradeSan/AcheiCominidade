import * as Location from "expo-location";
import { useState } from "react";

export type LocationResult = {
	latitude: number | null;
	longitude: number | null;
	loading: boolean;
	error: string | null;
};

export function useLocation() {
	const [state, setState] = useState<LocationResult>({
		latitude: null,
		longitude: null,
		loading: false,
		error: null,
	});

	async function captureCurrentLocation(): Promise<void> {
		setState((prev) => ({ ...prev, loading: true, error: null }));

		const permission = await Location.requestForegroundPermissionsAsync();

		if (permission.status !== "granted") {
			setState({
				latitude: null,
				longitude: null,
				loading: false,
				error:
					"Não foi possível acessar sua localização, digite o local manualmente.",
			});
			return;
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

			setState({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				loading: false,
				error: null,
			});
		} catch {
			setState({
				latitude: null,
				longitude: null,
				loading: false,
				error:
					"Não foi possível acessar sua localização, digite o local manualmente.",
			});
		}
	}

	return { ...state, captureCurrentLocation };
}
