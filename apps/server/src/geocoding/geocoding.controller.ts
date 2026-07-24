import { Controller, Get, Inject, Query } from "@nestjs/common";
import type {
	GeocodingReverseDto,
	GeocodingSearchDto,
} from "./dto/geocoding-query.dto";
import { GeocodingService } from "./geocoding.service";

@Controller("geocoding")
export class GeocodingController {
	constructor(
		@Inject(GeocodingService)
		private readonly geocodingService: GeocodingService,
	) {}

	@Get("search")
	search(@Query() query: GeocodingSearchDto) {
		return this.geocodingService.search(query.q, query.limit);
	}

	@Get("reverse")
	reverse(@Query() query: GeocodingReverseDto) {
		return this.geocodingService
			.reverse(query.lat, query.lon)
			.then((displayName) => ({ displayName }));
	}
}
