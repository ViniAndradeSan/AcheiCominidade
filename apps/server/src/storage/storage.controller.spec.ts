import { Test, type TestingModule } from "@nestjs/testing";
import { StorageController } from "./storage.controller";
import { StorageService } from "./storage.service";

jest.mock("@nestjs/swagger", () => ({
	ApiTags: () => () => {},
	ApiOperation: () => () => {},
	ApiResponse: () => () => {},
}));

describe("StorageController", () => {
	let controller: StorageController;

	const mockStorageService = {
		getPresignedUploadUrl: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StorageController],
			providers: [
				{ provide: StorageService, useValue: mockStorageService },
			],
		}).compile();

		controller = module.get<StorageController>(StorageController);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getPresignedUrl", () => {
		it("should return uploadUrl and publicUrl", async () => {
			const body = { filename: "photo.jpg", contentType: "image/jpeg" };
			const expected = {
				uploadUrl: "https://presigned.example.com/upload",
				publicUrl: "https://pub.example.com/found-items/uuid.jpg",
			};

			mockStorageService.getPresignedUploadUrl.mockResolvedValue(expected);

			const result = await controller.getPresignedUrl(body);

			expect(result).toEqual(expected);
			expect(mockStorageService.getPresignedUploadUrl).toHaveBeenCalledWith(
				"photo.jpg",
				"image/jpeg",
			);
		});

		it("should pass filename and contentType to service", async () => {
			const body = { filename: "document.pdf", contentType: "application/pdf" };

			mockStorageService.getPresignedUploadUrl.mockResolvedValue({
				uploadUrl: "https://presigned.example.com/upload",
				publicUrl: "https://pub.example.com/found-items/uuid.pdf",
			});

			await controller.getPresignedUrl(body);

			expect(mockStorageService.getPresignedUploadUrl).toHaveBeenCalledWith(
				"document.pdf",
				"application/pdf",
			);
		});
	});
});
