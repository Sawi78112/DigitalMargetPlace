import { BaseService } from "./base.service";
import { Category, CategoryInsert, CategoryUpdate } from "@/lib/types/database";

export class CategoryService extends BaseService<
  Category,
  CategoryInsert,
  CategoryUpdate
> {
  constructor() {
    super("categories");
  }

  /**
   * Find categories by name (case-insensitive search)
   */
  async findByName(name: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .ilike("name", name);

      if (error) {
        return { error, success: false };
      }

      return { data: data as Category[], success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Search categories by name and description
   */
  async searchCategories(
    query: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let dbQuery = supabase
        .from(this.tableName)
        .select("*", { count: "exact" })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order("name", { ascending: true });

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
          data: data as Category[],
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
   * Get categories with product count
   */
  async findWithProductCount(pagination?: { page?: number; limit?: number }) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          *,
          product_categories (count)
        `,
          { count: "exact" }
        )
        .order("name", { ascending: true });

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

  /**
   * Get category with its products
   */
  async findWithProducts(
    categoryId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          product_categories!inner (
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
          )
        `
        )
        .eq("id", categoryId)
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

  /**
   * Get popular categories (by product count)
   */
  async findPopularCategories(limit: number = 10) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase.from("product_categories").select(`
          category_id,
          categories (
            id,
            name,
            description,
            icon_url
          )
        `);

      if (error) {
        return { error, success: false };
      }

      // Count products per category
      const categoryCount: { [key: string]: { category: any; count: number } } =
        {};

      data.forEach((item: any) => {
        const categoryId = item.category_id;
        if (!categoryCount[categoryId]) {
          categoryCount[categoryId] = {
            category: item.categories,
            count: 0,
          };
        }
        categoryCount[categoryId].count++;
      });

      // Sort by count and take top categories
      const sortedCategories = Object.values(categoryCount)
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map((item) => ({
          ...item.category,
          product_count: item.count,
        }));

      return { data: sortedCategories, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Check if category name exists
   */
  async nameExists(name: string, excludeId?: string) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("id")
        .ilike("name", name);

      if (excludeId) {
        query = query.neq("id", excludeId);
      }

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      return { data: data.length > 0, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get categories ordered by name
   */
  async findAllOrdered(
    ascending: boolean = true,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findAll("*", pagination);
  }
}

export const categoryService = new CategoryService();
