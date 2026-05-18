import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, "../../../uploads/products");
const reviewUploadsRoot = path.resolve(__dirname, "../../../uploads/reviews");
const MAX_REVIEW_IMAGE_SIZE = 5 * 1024 * 1024;

const extensionByMime = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const isDataUrlImage = (value) =>
  typeof value === "string" && value.startsWith("data:image/");

export const saveProductImage = async (imageDataUrl, productCode = "product") => {
  if (!isDataUrlImage(imageDataUrl)) {
    return imageDataUrl || "";
  }

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return "";
  }

  const [, mimeType, base64Data] = match;
  const extension = extensionByMime[mimeType] || "png";
  const safeCode = String(productCode || "product").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const fileName = `${safeCode}-${Date.now()}.${extension}`;
  const filePath = path.join(uploadsRoot, fileName);

  await fs.mkdir(uploadsRoot, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(base64Data, "base64"));

  return `/uploads/products/${fileName}`;
};

export const saveReviewImage = async (imageDataUrl, productCode = "review") => {
  if (!isDataUrlImage(imageDataUrl)) {
    return "";
  }

  const match = imageDataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

  if (!match) {
    return "";
  }

  const [, mimeType, base64Data] = match;
  const imageBuffer = Buffer.from(base64Data, "base64");

  if (imageBuffer.byteLength > MAX_REVIEW_IMAGE_SIZE) {
    throw new Error("Review image size must be under 5MB.");
  }

  const extension = extensionByMime[mimeType] || "png";
  const safeCode = String(productCode || "review").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
  const fileName = `${safeCode}-review-${Date.now()}.${extension}`;
  const filePath = path.join(reviewUploadsRoot, fileName);

  await fs.mkdir(reviewUploadsRoot, { recursive: true });
  await fs.writeFile(filePath, imageBuffer);

  return `/uploads/reviews/${fileName}`;
};

export const deleteProductImage = async (imagePath = "") => {
  if (!imagePath || !imagePath.startsWith("/uploads/products/")) {
    return;
  }

  const fileName = path.basename(imagePath);
  const filePath = path.join(uploadsRoot, fileName);

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Product image delete skipped:", error.message);
    }
  }
};
