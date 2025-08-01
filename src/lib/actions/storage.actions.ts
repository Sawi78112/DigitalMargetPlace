"use server";

import { revalidatePath } from "next/cache";
import { storageService } from "@/lib/services";
import type { UploadFileParams } from "@/lib/services";

export async function uploadFile(params: UploadFileParams) {
  try {
    const result = await storageService.uploadFile(params);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (params.bucket === "products") {
      revalidatePath("/products");
      revalidatePath("/admin/products");
    } else if (params.bucket === "avatars") {
      revalidatePath("/profile");
      revalidatePath("/settings");
    }

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to upload file", success: false };
  }
}

export async function deleteFile(bucket: string, path: string) {
  try {
    const result = await storageService.deleteFile(bucket, path);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (bucket === "products") {
      revalidatePath("/products");
      revalidatePath("/admin/products");
    } else if (bucket === "avatars") {
      revalidatePath("/profile");
      revalidatePath("/settings");
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete file", success: false };
  }
}

export async function getFileUrl(bucket: string, path: string) {
  try {
    const result = await storageService.getPublicUrl(bucket, path);
    return result;
  } catch (error) {
    return { error: "Failed to get file URL", success: false };
  }
}

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
) {
  try {
    const result = await storageService.createSignedUrl(
      bucket,
      path,
      expiresIn
    );
    return result;
  } catch (error) {
    return { error: "Failed to get signed URL", success: false };
  }
}

export async function listFiles(
  bucket: string,
  folder?: string,
  options?: {
    limit?: number;
    offset?: number;
    search?: string;
  }
) {
  try {
    const result = await storageService.listFiles(bucket, folder, options);
    return result;
  } catch (error) {
    return { error: "Failed to list files", success: false };
  }
}

export async function getFileInfo(bucket: string, path: string) {
  try {
    const result = await storageService.getFileMetadata(bucket, path);
    return result;
  } catch (error) {
    return { error: "Failed to get file info", success: false };
  }
}

export async function moveFile(
  bucket: string,
  fromPath: string,
  toPath: string
) {
  try {
    const result = await storageService.moveFile(bucket, fromPath, toPath);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (bucket === "products") {
      revalidatePath("/products");
      revalidatePath("/admin/products");
    }

    return { success: true };
  } catch (error) {
    return { error: "Failed to move file", success: false };
  }
}

export async function copyFile(
  bucket: string,
  fromPath: string,
  toPath: string
) {
  try {
    const result = await storageService.copyFile(bucket, fromPath, toPath);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (bucket === "products") {
      revalidatePath("/products");
      revalidatePath("/admin/products");
    }

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to copy file", success: false };
  }
}

export async function uploadMultipleFiles(files: UploadFileParams[]) {
  try {
    const result = await storageService.uploadFiles(files);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    const hasProductFiles = files.some((f) => f.bucket === "products");
    const hasAvatarFiles = files.some((f) => f.bucket === "avatars");

    if (hasProductFiles) {
      revalidatePath("/products");
      revalidatePath("/admin/products");
    }
    if (hasAvatarFiles) {
      revalidatePath("/profile");
      revalidatePath("/settings");
    }

    return result;
  } catch (error) {
    return { error: "Failed to upload multiple files", success: false };
  }
}
