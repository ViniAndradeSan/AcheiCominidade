import { Platform } from "react-native";

/**
 * Resolve o host da API baseado na plataforma.
 *
 * Prioridade:
 * 1. EXPO_PUBLIC_API_URL definido no .env (override manual)
 * 2. Auto-detect:
 *    - iOS Simulator  → localhost
 *    - Android Emulator → 10.0.2.2
 *    - Web → localhost
 *    - Expo Go em celular físico → localhost (troque pelo IP da máquina no .env)
 *
 * Para testar em celular físico, defina no .env:
 *   EXPO_PUBLIC_API_URL=http://192.168.x.x:3000
 */
function resolveApiUrl(): string {
	if (process.env.EXPO_PUBLIC_API_URL) {
		return process.env.EXPO_PUBLIC_API_URL;
	}

	switch (Platform.OS) {
		case "android":
			// Emulador Android mapeia 10.0.2.2 → host machine
			return "http://10.0.2.2:3000";
		default:
			// iOS Simulator e Web
			return "http://localhost:3000";
	}
}

const API_URL = resolveApiUrl();

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...options.headers,
		},
		...options,
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`API error ${res.status}: ${body}`);
	}

	return res.json();
}
