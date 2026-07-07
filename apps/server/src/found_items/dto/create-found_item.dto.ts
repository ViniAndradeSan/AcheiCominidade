import {
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Max,
	Min,
} from "class-validator";

export class CreateFoundItemDto {
	@IsString()
	title: string;

	@IsOptional()
	@IsString()
	description?: string;

	@IsUUID()
	categoryId: string;

	@IsString()
	photoUrl: string;

	@IsString()
	foundLocationText: string;

	@IsOptional()
	@IsNumber()
	@Min(-90)
	@Max(90)
	foundLatitude?: number;

	@IsOptional()
	@IsNumber()
	@Min(-180)
	@Max(180)
	foundLongitude?: number;
}
