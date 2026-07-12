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

export class ApiError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(`API error ${status}: ${message}`);
		this.status = status;
	}
}

export class NetworkError extends Error {
	constructor() {
		super("Network request failed");
	}
}

export async function apiFetch<T>(
	path: string,
	options: RequestInit = {},
): Promise<T> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 10_000);

	try {
		const res = await fetch(`${API_URL}${path}`, {
			signal: controller.signal,
			headers: {
				"Content-Type": "application/json",
				...options.headers,
			},
			...options,
		});

		if (!res.ok) {
			const body = await res.text();
			let message: string;
			try {
				const parsed = JSON.parse(body);
				message = parsed?.message ?? body;
			} catch {
				message = body;
			}
			throw new ApiError(res.status, message);
		}

		return res.json();
	} catch (err) {
		if (err instanceof ApiError) throw err;
		if (err instanceof DOMException && err.name === "AbortError") {
			throw new ApiError(0, "Request timed out");
		}
		throw new NetworkError();
	} finally {
		clearTimeout(timeout);
	}
}
