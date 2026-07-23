import { getPresignedUploadUrl } from "@/lib/api/client";
import { uploadImageToR2 } from "./upload-image";

jest.mock("@/lib/api/client", () => ({
	getPresignedUploadUrl: jest.fn(),
}));

const mockedGetPresignedUploadUrl = jest.mocked(getPresignedUploadUrl);

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("uploadImageToR2", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should upload image to R2 and return publicUrl", async () => {
		mockedGetPresignedUploadUrl.mockResolvedValue({
			uploadUrl: "https://presigned.r2.example.com/upload",
			publicUrl: "https://pub.r2.example.com/found-items/uuid.jpg",
		});

		const mockBlob = new Blob(["image-data"]);
		const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };
		mockFetch
			.mockResolvedValueOnce(mockResponse)
			.mockResolvedValueOnce({ ok: true });

		const result = await uploadImageToR2(
			"file:///path/to/photo.jpg",
			"image/jpeg",
		);

		expect(result).toBe("https://pub.r2.example.com/found-items/uuid.jpg");
		expect(mockedGetPresignedUploadUrl).toHaveBeenCalledWith(
			"photo.jpg",
			"image/jpeg",
		);
	});

	it("should call presign endpoint with correct filename", async () => {
		mockedGetPresignedUploadUrl.mockResolvedValue({
			uploadUrl: "https://presigned.r2.example.com/upload",
			publicUrl: "https://pub.r2.example.com/found-items/uuid.png",
		});

		const mockBlob = new Blob(["image-data"]);
		const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };
		mockFetch
			.mockResolvedValueOnce(mockResponse)
			.mockResolvedValueOnce({ ok: true });

		await uploadImageToR2(
			"file:///path/to/image.png",
			"image/png",
		);

		expect(mockedGetPresignedUploadUrl).toHaveBeenCalledWith(
			"image.png",
			"image/png",
		);
	});

	it("should PUT blob to presigned URL with correct Content-Type", async () => {
		mockedGetPresignedUploadUrl.mockResolvedValue({
			uploadUrl: "https://presigned.r2.example.com/upload",
			publicUrl: "https://pub.r2.example.com/found-items/uuid.jpg",
		});

		const mockBlob = new Blob(["image-data"]);
		const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };
		mockFetch
			.mockResolvedValueOnce(mockResponse)
			.mockResolvedValueOnce({ ok: true });

		await uploadImageToR2(
			"file:///path/to/photo.jpg",
			"image/jpeg",
		);

		expect(mockFetch).toHaveBeenCalledWith(
			"https://presigned.r2.example.com/upload",
			{
				method: "PUT",
				body: mockBlob,
				headers: { "Content-Type": "image/jpeg" },
			},
		);
	});

	it("should throw when upload to R2 fails", async () => {
		mockedGetPresignedUploadUrl.mockResolvedValue({
			uploadUrl: "https://presigned.r2.example.com/upload",
			publicUrl: "https://pub.r2.example.com/found-items/uuid.jpg",
		});

		const mockBlob = new Blob(["image-data"]);
		const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };
		mockFetch
			.mockResolvedValueOnce(mockResponse)
			.mockResolvedValueOnce({ ok: false, status: 500 });

		await expect(
			uploadImageToR2("file:///path/to/photo.jpg", "image/jpeg"),
		).rejects.toThrow("Upload to R2 failed: 500");
	});

	it("should default to jpg extension when filename has no extension", async () => {
		mockedGetPresignedUploadUrl.mockResolvedValue({
			uploadUrl: "https://presigned.r2.example.com/upload",
			publicUrl: "https://pub.r2.example.com/found-items/uuid.jpg",
		});

		const mockBlob = new Blob(["image-data"]);
		const mockResponse = { blob: jest.fn().mockResolvedValue(mockBlob) };
		mockFetch
			.mockResolvedValueOnce(mockResponse)
			.mockResolvedValueOnce({ ok: true });

		await uploadImageToR2("file:///path/to/photo", "image/jpeg");

		expect(mockedGetPresignedUploadUrl).toHaveBeenCalledWith(
			"photo",
			"image/jpeg",
		);
	});
});
