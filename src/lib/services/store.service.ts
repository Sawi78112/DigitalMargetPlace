import { BaseService } from "./base.service";
import {
  Store,
  StoreInsert,
  StoreUpdate,
  StoreBlog,
  StoreBlogInsert,
  StoreBlogUpdate,
} from "@/lib/types/database";

export class StoreService extends BaseService<Store, StoreInsert, StoreUpdate> {
  constructor() {
    super("stores");
  }

  /**
   * Find stores by owner ID
   */
  async findByOwnerId(
    ownerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("owner_id", ownerId, "*", pagination);
  }

  /**
   * Find active stores only
   */
  async findActiveStores(pagination?: { page?: number; limit?: number }) {
    return this.findBy("is_active", true, "*", pagination);
  }

  /**
   * Find store by owner (should be unique)
   */
  async findByOwner(ownerId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("owner_id", ownerId)
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as Store, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Search stores by name and description
   */
  async searchStores(
    query: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let dbQuery = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq("is_active", true)
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
          data: data as Store[],
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
   * Get store with products
   */
  async findWithProducts(
    storeId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          *,
          products (
            id,
            title,
            description,
            price,
            visibility,
            storage_path,
            download_count,
            created_at,
            updated_at
          )
        `
        )
        .eq("id", storeId)
        .single();

      const { data, error } = await query;

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
   * Get store statistics
   */
  async getStoreStats(storeId: string) {
    try {
      const supabase = await this.getClient();

      const { data: productData, error: productError } = await supabase
        .from("products")
        .select("id", { count: "exact" })
        .eq("store_id", storeId);

      if (productError) {
        return { error: productError, success: false };
      }

      const productCount = productData?.length || 0;

      const { data: downloadData, error: downloadError } = await supabase
        .from("products")
        .select("download_count")
        .eq("store_id", storeId);

      if (downloadError) {
        return { error: downloadError, success: false };
      }

      const totalDownloads = downloadData.reduce(
        (sum, product) => sum + (product.download_count || 0),
        0
      );

      const { data: salesData, error: salesError } = await supabase
        .from("sales_analytics")
        .select("gross_amount, seller_earnings")
        .eq("store_id", storeId);

      if (salesError) {
        return { error: salesError, success: false };
      }

      const totalRevenue = salesData.reduce(
        (sum, sale) => sum + Number(sale.gross_amount),
        0
      );
      const totalEarnings = salesData.reduce(
        (sum, sale) => sum + Number(sale.seller_earnings),
        0
      );

      return {
        data: {
          productCount: productCount || 0,
          totalDownloads,
          totalRevenue,
          totalEarnings,
          totalSales: salesData.length,
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
   * Toggle store active status
   */
  async toggleActiveStatus(storeId: string) {
    try {
      const { data: store } = await this.findById(storeId, "is_active");
      if (!store) {
        return { error: "Store not found", success: false };
      }

      return this.update(storeId, { is_active: !store.is_active });
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export class StoreBlogService extends BaseService<
  StoreBlog,
  StoreBlogInsert,
  StoreBlogUpdate
> {
  constructor() {
    super("store_blogs");
  }

  /**
   * Find blogs by store ID
   */
  async findByStoreId(
    storeId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("store_id", storeId, "*", pagination);
  }

  /**
   * Find blogs by author ID
   */
  async findByAuthorId(
    authorId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("author_id", authorId, "*", pagination);
  }

  /**
   * Find published blogs only
   */
  async findPublishedBlogs(
    storeId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("is_published", true)
        .not("published_at", "is", null)
        .order("published_at", { ascending: false });

      if (storeId) {
        query = query.eq("store_id", storeId);
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
          data: data as StoreBlog[],
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
   * Find draft blogs
   */
  async findDraftBlogs(
    storeId?: string,
    authorId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .eq("is_published", false)
        .order("updated_at", { ascending: false });

      if (storeId) {
        query = query.eq("store_id", storeId);
      }

      if (authorId) {
        query = query.eq("author_id", authorId);
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
          data: data as StoreBlog[],
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
   * Publish a blog post
   */
  async publishBlog(blogId: string) {
    const publishedAt = new Date().toISOString();
    return this.update(blogId, {
      is_published: true,
      published_at: publishedAt,
    });
  }

  /**
   * Unpublish a blog post
   */
  async unpublishBlog(blogId: string) {
    return this.update(blogId, {
      is_published: false,
      published_at: null,
    });
  }

  /**
   * Search blog posts
   */
  async searchBlogs(
    query: string,
    storeId?: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let dbQuery = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .or(
          `title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`
        )
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (storeId) {
        dbQuery = dbQuery.eq("store_id", storeId);
      }

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
          data: data as StoreBlog[],
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
   * Get blog with store and author info
   */
  async findWithDetails(blogId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          stores (
            id,
            name,
            description,
            logo_url
          )
        `
        )
        .eq("id", blogId)
        .single();

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
}

export const storeService = new StoreService();
export const storeBlogService = new StoreBlogService();
