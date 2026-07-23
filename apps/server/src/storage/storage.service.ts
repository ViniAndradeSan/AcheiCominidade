import { Injectable } from "@nestjs/common";
import {
	S3Client,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

@Injectable()
export class StorageService {
	private readonly s3Client: S3Client;
	private readonly bucketName: string;
	private readonly publicUrl: string;

	constructor() {
		const accountId = process.env.R2_ACCOUNT_ID;
		const accessKeyId = process.env.R2_ACCESS_KEY_ID;
		const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
		this.bucketName = process.env.R2_BUCKET_NAME ?? "";
		this.publicUrl = process.env.R2_PUBLIC_URL ?? "";

		if (!accountId || !accessKeyId || !secretAccessKey || !this.bucketName) {
			throw new Error("R2 environment variables not configured");
		}

		this.s3Client = new S3Client({
			region: "auto",
			endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}

	async getPresignedUploadUrl(
		filename: string,
		contentType: string,
	): Promise<{ uploadUrl: string; publicUrl: string }> {
		const extension = filename.split(".").pop() ?? "jpg";
		const key = `found-items/${randomUUID()}.${extension}`;

		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: key,
			ContentType: contentType,
		});

		const uploadUrl = await getSignedUrl(this.s3Client, command, {
			expiresIn: 3600,
		});

		const publicUrl = `${this.publicUrl}/${key}`;

		return { uploadUrl, publicUrl };
	}
}