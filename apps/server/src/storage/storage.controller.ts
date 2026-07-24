import { Controller, Post, Body, HttpCode, HttpStatus, Logger } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { IsString, MaxLength } from "class-validator";
import { StorageService } from "./storage.service";

class PresignUploadDto {
	@IsString()
	@MaxLength(255)
	filename!: string;

	@IsString()
	@MaxLength(100)
	contentType!: string;
}

class PresignResponseDto {
	uploadUrl!: string;
	publicUrl!: string;
}

@ApiTags("uploads")
@Controller("uploads")
export class StorageController {
	private readonly logger = new Logger(StorageController.name);
	constructor(private readonly storageService: StorageService) {}

	@Post("presign")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Get presigned URL for direct R2 upload" })
	@ApiResponse({ status: 200, type: PresignResponseDto })
	async getPresignedUrl(
		@Body() body: PresignUploadDto,
	): Promise<PresignResponseDto> {
		this.logger.log(`presign body: ${JSON.stringify(body)}`);
		const { uploadUrl, publicUrl } =
			await this.storageService.getPresignedUploadUrl(
				body.filename,
				body.contentType,
			);
		return { uploadUrl, publicUrl };
	}
}