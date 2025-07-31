import { BaseService } from "./base.service";
import {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductVisibility,
  ProductPhoto,
  ProductPhotoInsert,
  ProductCategory,
  ProductCategoryInsert,
} from "@/lib/types/database";

export class ProductService extends BaseService<
  Product,
  ProductInsert,
  ProductUpdate
> {
  constructor() {
    super("products");
  }

  /**
   * Find products by store ID
   */
  async findByStoreId(
    storeId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("store_id", storeId, "*", pagination);
  }

  /**
   * Find products by visibility
   */
  async findByVisibility(
    visibility: ProductVisibility,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("visibility", visibility, "*", pagination);
  }

  /**
   * Find visible products only
   */
  async findVisibleProducts(pagination?: { page?: number; limit?: number }) {
    return this.findByVisibility("visible", pagination);
  }

  /**
   * Search products by title and description
   */
  async searchProducts(
    query: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let dbQuery = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .eq("visibility", "visible")
        .order("created_at", { ascending: false });

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        dbQuery = dbQuery.range(from, to);
      }

      const { data, error, count } = await dbQuery;

      if (error) {
        return { error, success: false };
      }

      const paginationInfo = pagination
        ? {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            hasNextPage: count
              ? (pagination.page || 1) * (pagination.limit || 10) < count
              : false,
            hasPreviousPage: (pagination.page || 1) > 1,
          }
        : {
            page: 1,
            limit: count || 0,
            hasNextPage: false,
            hasPreviousPage: false,
          };

      return {
        data: {
          data: data as Product[],
          count: count || 0,
          ...paginationInfo,
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
   * Get products with their photos
   */
  async findWithPhotos(
    productId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          *,
          product_photos (
            id,
            type,
            storage_path,
            display_order,
            created_at
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      if (productId) {
        query = query.eq("id", productId);
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return { error, success: false };
      }

      if (productId) {
        return { data: data?.[0] || null, success: true };
      }

      const paginationInfo = pagination
        ? {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            hasNextPage: count
              ? (pagination.page || 1) * (pagination.limit || 10) < count
              : false,
            hasPreviousPage: (pagination.page || 1) > 1,
          }
        : {
            page: 1,
            limit: count || 0,
            hasNextPage: false,
            hasPreviousPage: false,
          };

      return {
        data: {
          data: data as any[],
          count: count || 0,
          ...paginationInfo,
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
   * Get products with categories
   */
  async findWithCategories(
    productId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          *,
          product_categories!inner (
            categories (
              id,
              name,
              description
            )
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      if (productId) {
        query = query.eq("id", productId);
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return { error, success: false };
      }

      if (productId) {
        return { data: data?.[0] || null, success: true };
      }

      const paginationInfo = pagination
        ? {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            hasNextPage: count
              ? (pagination.page || 1) * (pagination.limit || 10) < count
              : false,
            hasPreviousPage: (pagination.page || 1) > 1,
          }
        : {
            page: 1,
            limit: count || 0,
            hasNextPage: false,
            hasPreviousPage: false,
          };

      return {
        data: {
          data: data as any[],
          count: count || 0,
          ...paginationInfo,
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
   * Increment download count
   */
  async incrementDownloadCount(productId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.rpc("increment_download_count", {
        product_id: productId,
      });

      if (error) {
        // Fallback to manual increment if RPC doesn't exist
        const { data: product } = await this.findById(
          productId,
          "download_count"
        );
        if (product) {
          const newCount = (product.download_count || 0) + 1;
          return this.update(productId, { download_count: newCount });
        }
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
   * Get products by price range
   */
  async findByPriceRange(
    minPrice: number,
    maxPrice: number,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .gte("price", minPrice)
        .lte("price", maxPrice)
        .eq("visibility", "visible")
        .order("created_at", { ascending: false });

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return { error, success: false };
      }

      const paginationInfo = pagination
        ? {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            hasNextPage: count
              ? (pagination.page || 1) * (pagination.limit || 10) < count
              : false,
            hasPreviousPage: (pagination.page || 1) > 1,
          }
        : {
            page: 1,
            limit: count || 0,
            hasNextPage: false,
            hasPreviousPage: false,
          };

      return {
        data: {
          data: data as Product[],
          count: count || 0,
          ...paginationInfo,
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
}

export class ProductPhotoService extends BaseService<
  ProductPhoto,
  ProductPhotoInsert,
  ProductPhoto
> {
  constructor() {
    super("product_photos");
  }

  /**
   * Find photos by product ID
   */
  async findByProductId(productId: string) {
    return this.findBy("product_id", productId, "*");
  }

  /**
   * Find cover photo for a product
   */
  async findCoverPhoto(productId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("product_id", productId)
        .eq("type", "cover_photo")
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as ProductPhoto, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Find gallery photos for a product
   */
  async findGalleryPhotos(productId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("product_id", productId)
        .eq("type", "gallery_photo")
        .order("display_order", { ascending: true });

      if (error) {
        return { error, success: false };
      }

      return { data: data as ProductPhoto[], success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Reorder photos
   */
  async reorderPhotos(photoUpdates: { id: string; display_order: number }[]) {
    try {
      const supabase = await this.getClient();

      const updates = photoUpdates.map((update) =>
        supabase
          .from(this.tableName)
          .update({ display_order: update.display_order })
          .eq("id", update.id)
      );

      const results = await Promise.all(updates);

      for (const result of results) {
        if (result.error) {
          return { error: result.error, success: false };
        }
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
}

export class ProductCategoryService extends BaseService<
  ProductCategory,
  ProductCategoryInsert,
  ProductCategory
> {
  constructor() {
    super("product_categories");
  }

  /**
   * Find categories by product ID
   */
  async findByProductId(productId: string) {
    return this.findBy("product_id", productId, "*");
  }

  /**
   * Find products by category ID
   */
  async findByCategoryId(
    categoryId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("category_id", categoryId, "*", pagination);
  }

  /**
   * Add product to category
   */
  async addProductToCategory(productId: string, categoryId: string) {
    return this.create({ product_id: productId, category_id: categoryId });
  }

  /**
   * Remove product from category
   */
  async removeProductFromCategory(productId: string, categoryId: string) {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("product_id", productId)
        .eq("category_id", categoryId);

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
   * Get products with category details
   */
  async getProductsWithCategories(
    categoryId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase.from(this.tableName).select(
        `
          *,
          products (*),
          categories (*)
        `,
        { count: "exact" }
      );

      if (categoryId) {
        query = query.eq("category_id", categoryId);
      }

      if (pagination) {
        const { page = 1, limit = 10 } = pagination;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);
      }

      const { data, error, count } = await query;

      if (error) {
        return { error, success: false };
      }

      const paginationInfo = pagination
        ? {
            page: pagination.page || 1,
            limit: pagination.limit || 10,
            hasNextPage: count
              ? (pagination.page || 1) * (pagination.limit || 10) < count
              : false,
            hasPreviousPage: (pagination.page || 1) > 1,
          }
        : {
            page: 1,
            limit: count || 0,
            hasNextPage: false,
            hasPreviousPage: false,
          };

      return {
        data: {
          data: data as any[],
          count: count || 0,
          ...paginationInfo,
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
}

export const productService = new ProductService();
export const productPhotoService = new ProductPhotoService();
export const productCategoryService = new ProductCategoryService();
