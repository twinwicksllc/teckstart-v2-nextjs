import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
});

const BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.AWS_S3_BUCKET || "teckstart.com";
const RECEIPTS_PREFIX = "receipts";
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export interface UploadReceiptOptions {
  userId: number;
  projectId?: number;
  fileName: string;
  fileBuffer: Buffer;
  fileType: string;
}

export interface UploadResult {
  s3Key: string;
  compressedSize: number;
  originalSize: number;
}

/**
 * Validate receipt file before upload
 */
export function validateReceiptFile(fileBuffer: Buffer, fileType: string): { valid: boolean; error?: string } {
  if (fileBuffer.length > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum of 50MB. Please compress or choose a different image.`,
    };
  }

  // Reject multi-page PDFs
  if (fileType === "application/pdf") {
    return {
      valid: false,
      error: "Multi-page PDFs are not supported in this version. Please convert to individual images or upload one page at a time.",
    };
  }

  // Supported types
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  if (!supportedTypes.includes(fileType)) {
    return {
      valid: false,
      error: `Unsupported file type: ${fileType}. Supported types: JPG, PNG, GIF, WebP.`,
    };
  }

  return { valid: true };
}

/**
 * Compress image file using sharp
 */
async function compressImage(buffer: Buffer, fileType: string): Promise<Buffer> {
  try {
    let transformer = sharp(buffer);

    // Get metadata to check for issues
    const metadata = await transformer.metadata();

    // Reject very small images (likely low-quality photos)
    if (metadata.width && metadata.width < 300) {
      throw new Error("Image resolution too low (< 300px width). Please use a clearer photo.");
    }

    // Compress while preserving quality
    if (fileType === "image/jpeg" || fileType === "image/jpg") {
      transformer = transformer.jpeg({ quality: 85, progressive: true });
    } else if (fileType === "image/png") {
      transformer = transformer.png({ quality: 80 });
    } else if (fileType === "image/webp") {
      transformer = transformer.webp({ quality: 80 });
    }

    return transformer.toBuffer();
  } catch (error) {
    console.error("Image compression failed:", error);
    throw new Error("Failed to compress image. Please ensure the file is a valid image.");
  }
}

/**
 * Upload receipt to S3 with compression
 */
export async function uploadReceiptToS3(options: UploadReceiptOptions): Promise<UploadResult> {
  const { userId, projectId, fileName, fileBuffer, fileType } = options;

  // Validate first
  const validation = validateReceiptFile(fileBuffer, fileType);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Compress the file
  let compressedBuffer = fileBuffer;
  try {
    if (fileType.startsWith("image/")) {
      compressedBuffer = await compressImage(fileBuffer, fileType);
    }
  } catch (error) {
    console.error("Compression error:", error);
    // Fall back to original if compression fails
    compressedBuffer = fileBuffer;
  }

  // Generate S3 key
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).substring(2, 8);
  const extension = fileName.split(".").pop();
  const s3Key = `${RECEIPTS_PREFIX}/${userId}/${projectId || "general"}/${timestamp}-${randomId}.${extension}`;

  // Upload to S3
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: s3Key,
      Body: compressedBuffer,
      ContentType: fileType,
      ServerSideEncryption: "AES256",
      Metadata: {
        originalFileName: fileName,
        uploadedBy: userId.toString(),
      },
    });

    await s3Client.send(command);

    return {
      s3Key,
      originalSize: fileBuffer.length,
      compressedSize: compressedBuffer.length,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error("Failed to upload file to storage. Please try again.");
  }
}

/**
 * Generate signed URL for downloading receipt from S3
 */
export function getReceiptS3Url(s3Key: string): string {
  return `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Key}`;
}
