import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { StorageService } from "./storage.service";

class PresignUploadDto {
	filename!: string;
	contentType!: string;
}

class PresignResponseDto {
	uploadUrl!: string;
	publicUrl!: string;
}

@ApiTags("uploads")
@Controller("uploads")
export class StorageController {
	constructor(private readonly storageService: StorageService) {}

	@Post("presign")
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: "Get presigned URL for direct R2 upload" })
	@ApiResponse({ status: 200, type: PresignResponseDto })
	async getPresignedUrl(
		@Body() body: PresignUploadDto,
	): Promise<PresignResponseDto> {
		const { uploadUrl, publicUrl } =
			await this.storageService.getPresignedUploadUrl(
				body.filename,
				body.contentType,
			);
		return { uploadUrl, publicUrl };
	}
}