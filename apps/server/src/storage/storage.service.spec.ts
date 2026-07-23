import { Test, type TestingModule } from "@nestjs/testing";
import { StorageService } from "./storage.service";

jest.mock("@aws-sdk/client-s3", () => {
	const mockPutObjectCommand = jest.fn();
	return {
		S3Client: jest.fn().mockImplementation(() => ({})),
		PutObjectCommand: mockPutObjectCommand,
	};
});

jest.mock("@aws-sdk/s3-request-presigner", () => ({
	getSignedUrl: jest.fn().mockResolvedValue("https://presigned.example.com/upload"),
}));

jest.mock("crypto", () => ({
	randomUUID: jest.fn().mockReturnValue("mock-uuid-123"),
}));

describe("StorageService", () => {
	let service: StorageService;

	const originalEnv = process.env;

	beforeEach(async () => {
		process.env = {
			...originalEnv,
			R2_ACCOUNT_ID: "test-account-id",
			R2_ACCESS_KEY_ID: "test-access-key",
			R2_SECRET_ACCESS_KEY: "test-secret-key",
			R2_BUCKET_NAME: "test-bucket",
			R2_PUBLIC_URL: "https://pub-test.example.com",
		};

		const module: TestingModule = await Test.createTestingModule({
			providers: [StorageService],
		}).compile();

		service = module.get<StorageService>(StorageService);
	});

	afterEach(() => {
		process.env = originalEnv;
		jest.clearAllMocks();
	});

	describe("constructor", () => {
		it("should throw when R2_ACCOUNT_ID is missing", () => {
			delete process.env.R2_ACCOUNT_ID;

			expect(() => new StorageService()).toThrow(
				"R2 environment variables not configured",
			);
		});

		it("should throw when R2_ACCESS_KEY_ID is missing", () => {
			delete process.env.R2_ACCESS_KEY_ID;

			expect(() => new StorageService()).toThrow(
				"R2 environment variables not configured",
			);
		});

		it("should throw when R2_SECRET_ACCESS_KEY is missing", () => {
			delete process.env.R2_SECRET_ACCESS_KEY;

			expect(() => new StorageService()).toThrow(
				"R2 environment variables not configured",
			);
		});

		it("should throw when R2_BUCKET_NAME is missing", () => {
			delete process.env.R2_BUCKET_NAME;

			expect(() => new StorageService()).toThrow(
				"R2 environment variables not configured",
			);
		});
	});

	describe("getPresignedUploadUrl", () => {
		it("should return uploadUrl and publicUrl", async () => {
			const result = await service.getPresignedUploadUrl(
				"photo.jpg",
				"image/jpeg",
			);

			expect(result).toEqual({
				uploadUrl: "https://presigned.example.com/upload",
				publicUrl: "https://pub-test.example.com/found-items/mock-uuid-123.jpg",
			});
		});

		it("should generate key with UUID and correct extension", async () => {
			await service.getPresignedUploadUrl("image.png", "image/png");

			const { PutObjectCommand } = require("@aws-sdk/client-s3");
			expect(PutObjectCommand).toHaveBeenCalledWith({
				Bucket: "test-bucket",
				Key: "found-items/mock-uuid-123.png",
				ContentType: "image/png",
			});
		});

		it("should handle filename with no dot (extension defaults to full name)", async () => {
			await service.getPresignedUploadUrl("photo", "image/jpeg");

			const { PutObjectCommand } = require("@aws-sdk/client-s3");
			expect(PutObjectCommand).toHaveBeenCalledWith(
				expect.objectContaining({
					Key: "found-items/mock-uuid-123.photo",
				}),
			);
		});

		it("should use default publicUrl when R2_PUBLIC_URL is not set", async () => {
			delete process.env.R2_PUBLIC_URL;

			const module: TestingModule = await Test.createTestingModule({
				providers: [StorageService],
			}).compile();

			const serviceWithoutUrl = module.get<StorageService>(StorageService);
			const result = await serviceWithoutUrl.getPresignedUploadUrl(
				"photo.jpg",
				"image/jpeg",
			);

			expect(result.publicUrl).toBe("/found-items/mock-uuid-123.jpg");
		});
	});
});
