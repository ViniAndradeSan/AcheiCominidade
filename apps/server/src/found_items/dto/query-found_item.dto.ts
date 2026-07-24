import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { Type } from "class-transformer";
import { ItemStatus } from "../../generated/prisma/client";

export class QueryFoundItemDto {
	@IsOptional()
	@IsEnum(ItemStatus)
	status?: ItemStatus;

	@IsOptional()
	@IsString()
	category?: string;

	@IsOptional()
	@IsString()
	search?: string;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1)
	@Max(100)
	limit?: number;
}
