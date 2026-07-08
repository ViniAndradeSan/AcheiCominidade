const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000";

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
