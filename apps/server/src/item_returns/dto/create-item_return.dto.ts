import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateItemReturnDto {
	@IsUUID()
	itemId: string;

	@IsOptional()
	@IsString()
	observation?: string;
}
