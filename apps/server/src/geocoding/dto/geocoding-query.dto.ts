import { IsNumber, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";

export class GeocodingSearchDto {
	@IsString()
	q: string;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(1)
	@Max(20)
	limit?: number;
}

export class GeocodingReverseDto {
	@Type(() => Number)
	@IsNumber()
	@Min(-90)
	@Max(90)
	lat: number;

	@Type(() => Number)
	@IsNumber()
	@Min(-180)
	@Max(180)
	lon: number;
}
