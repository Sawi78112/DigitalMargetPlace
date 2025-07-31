import { createClient } from "@/lib/supabase/server";
import { ServiceResponse } from "./base.service";
import { StorageError } from "@supabase/storage-js";

export interface StorageServiceResponse<T> {
  data?: T;
  error?: string | StorageError;
  success: boolean;
}

export interface UploadFileParams {
  file: File;
  bucket: string;
  path: string;
  options?: {
    upsert?: boolean;
    contentType?: string;
  };
}

export interface UploadResult {
  path: string;
  fullPath: string;
  publicUrl: string;
}

export class StorageService {
  private async getClient() {
    return await createClient();
  }

  /**
   * Upload a file to Supabase Storage
   */
  async uploadFile({
    file,
    bucket,
    path,
    options = {},
  }: UploadFileParams): Promise<StorageServiceResponse<UploadResult>> {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          upsert: options.upsert || false,
          contentType: options.contentType || file.type,
        });

      if (error) {
        return { error, success: false };
      }

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      return {
        data: {
          path: data.path,
          fullPath: `${bucket}/${data.path}`,
          publicUrl: urlData.publicUrl,
        },
        success: true,
      };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Upload multiple files to Supabase Storage
   */
  async uploadFiles(
    files: UploadFileParams[]
  ): Promise<StorageServiceResponse<UploadResult[]>> {
    try {
      const results: UploadResult[] = [];

      for (const fileParams of files) {
        const result = await this.uploadFile(fileParams);
        if (!result.success || !result.data) {
          return { error: result.error, success: false };
        }
        results.push(result.data);
      }

      return { data: results, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Delete a file from Supabase Storage
   */
  async deleteFile(
    bucket: string,
    path: string
  ): Promise<StorageServiceResponse<void>> {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase.storage.from(bucket).remove([path]);

      if (error) {
        return { error, success: false };
      }

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Delete multiple files from Supabase Storage
   */
  async deleteFiles(
    bucket: string,
    paths: string[]
  ): Promise<StorageServiceResponse<void>> {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase.storage.from(bucket).remove(paths);

      if (error) {
        return { error, success: false };
      }

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get public URL for a file
   */
  async getPublicUrl(
    bucket: string,
    path: string
  ): Promise<StorageServiceResponse<string>> {
    try {
      const supabase = await this.getClient();

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);

      return { data: data.publicUrl, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Create a signed URL for file access (for private buckets)
   */
  async createSignedUrl(
    bucket: string,
    path: string,
    expiresIn: number = 3600
  ): Promise<StorageServiceResponse<string>> {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) {
        return { error, success: false };
      }

      return { data: data.signedUrl, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * List files in a bucket/folder
   */
  async listFiles(
    bucket: string,
    path: string = "",
    options?: {
      limit?: number;
      offset?: number;
      sortBy?: { column: string; order: "asc" | "desc" };
    }
  ): Promise<StorageServiceResponse<any[]>> {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, options);

      if (error) {
        return { error, success: false };
      }

      return { data, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Move/rename a file
   */
  async moveFile(
    bucket: string,
    fromPath: string,
    toPath: string
  ): Promise<StorageServiceResponse<void>> {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase.storage
        .from(bucket)
        .move(fromPath, toPath);

      if (error) {
        return { error, success: false };
      }

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Copy a file
   */
  async copyFile(
    bucket: string,
    fromPath: string,
    toPath: string
  ): Promise<StorageServiceResponse<void>> {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase.storage
        .from(bucket)
        .copy(fromPath, toPath);

      if (error) {
        return { error, success: false };
      }

      return { success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Generate a unique file path with timestamp
   */
  generateUniqueFilePath(folder: string, filename: string): string {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = filename.split(".").pop();
    const nameWithoutExt = filename.replace(`.${extension}`, "");
    return `${folder}/${nameWithoutExt}_${timestamp}_${randomStr}.${extension}`;
  }

  /**
   * Get file size and metadata
   */
  async getFileMetadata(
    bucket: string,
    path: string
  ): Promise<StorageServiceResponse<any>> {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.storage.from(bucket).list("", {
        search: path,
      });

      if (error) {
        return { error, success: false };
      }

      const file = data.find((f) => f.name === path.split("/").pop());

      return { data: file, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export const storageService = new StorageService();
