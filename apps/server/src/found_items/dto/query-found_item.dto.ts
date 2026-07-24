import { IsEnum, IsOptional, IsString } from "class-validator";
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
}
