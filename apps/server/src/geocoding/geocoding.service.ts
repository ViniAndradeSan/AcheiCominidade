import { Injectable, Logger } from "@nestjs/common";

const NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
const USER_AGENT = "AcheiComunidade/1.0 (https://github.com/achei-comunidade)";
const NOMINATIM_DELAY_MS = 1100;

export interface GeocodingSuggestion {
	displayName: string;
	latitude: number;
	longitude: number;
}

@Injectable()
export class GeocodingService {
	private readonly logger = new Logger(GeocodingService.name);
	private lastRequestTime = 0;

	private async throttledFetch(url: string): Promise<Response> {
		const now = Date.now();
		const elapsed = now - this.lastRequestTime;
		if (elapsed < NOMINATIM_DELAY_MS) {
			await new Promise((r) =>
				setTimeout(r, NOMINATIM_DELAY_MS - elapsed),
			);
		}

		this.lastRequestTime = Date.now();

		return fetch(url, {
			headers: {
				"User-Agent": USER_AGENT,
				Accept: "application/json",
			},
		});
	}

	async search(
		query: string,
		limit = 5,
	): Promise<GeocodingSuggestion[]> {
		const params = new URLSearchParams({
			q: query,
			format: "jsonv2",
			limit: String(limit),
			addressdetails: "0",
		});

		const url = `${NOMINATIM_BASE}/search?${params}`;

		try {
			const res = await this.throttledFetch(url);

			if (!res.ok) {
				this.logger.warn(
					`Nominatim search returned ${res.status}: ${res.statusText}`,
				);
				return [];
			}

			const data = (await res.json()) as Array<{
				display_name: string;
				lat: string;
				lon: string;
			}>;

			return data.map((item) => ({
				displayName: item.display_name,
				latitude: Number.parseFloat(item.lat),
				longitude: Number.parseFloat(item.lon),
			}));
		} catch (err) {
			this.logger.error("Nominatim search failed", err);
			return [];
		}
	}

	async reverse(lat: number, lon: number): Promise<string | null> {
		const params = new URLSearchParams({
			lat: String(lat),
			lon: String(lon),
			format: "jsonv2",
		});

		const url = `${NOMINATIM_BASE}/reverse?${params}`;

		try {
			const res = await this.throttledFetch(url);

			if (!res.ok) {
				this.logger.warn(
					`Nominatim reverse returned ${res.status}: ${res.statusText}`,
				);
				return null;
			}

			const data = (await res.json()) as {
				display_name?: string;
				address?: Record<string, string>;
			};

			if (data?.display_name) {
				return data.display_name;
			}

			if (data?.address) {
				const addr = data.address;
				const parts = [
					addr.road || addr.pedestrian,
					addr.house_number,
					addr.suburb || addr.neighbourhood,
					addr.city || addr.town || addr.village,
					addr.state,
				].filter(Boolean);
				return parts.join(", ") || null;
			}

			return null;
		} catch (err) {
			this.logger.error("Nominatim reverse failed", err);
			return null;
		}
	}
}
