import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";

export interface ServiceResponse<T> {
  data?: T;
  error?: string | PostgrestError;
  success: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export abstract class BaseService<TRow, TInsert, TUpdate> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  protected async getClient() {
    return await createClient();
  }

  async findAll(
    columns: string = "*",
    pagination?: PaginationParams
  ): Promise<ServiceResponse<PaginatedResponse<TRow>>> {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(columns, { count: "exact" });

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
          data: data as TRow[],
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

  async findById(
    id: string,
    columns: string = "*"
  ): Promise<ServiceResponse<TRow>> {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select(columns)
        .eq("id", id)
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as TRow, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  async create(data: TInsert): Promise<ServiceResponse<TRow>> {
    try {
      const supabase = await this.getClient();

      const { data: createdData, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: createdData as TRow, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  async update(id: string, data: TUpdate): Promise<ServiceResponse<TRow>> {
    try {
      const supabase = await this.getClient();

      const { data: updatedData, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: updatedData as TRow, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  async delete(id: string): Promise<ServiceResponse<void>> {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("id", id);

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

  async findBy(
    column: string,
    value: any,
    columns: string = "*",
    pagination?: PaginationParams
  ): Promise<ServiceResponse<PaginatedResponse<TRow>>> {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(columns, { count: "exact" })
        .eq(column, value);

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
          data: data as TRow[],
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

  async count(): Promise<ServiceResponse<number>> {
    try {
      const supabase = await this.getClient();

      const { count, error } = await supabase
        .from(this.tableName)
        .select("*", { count: "exact", head: true });

      if (error) {
        return { error, success: false };
      }

      return { data: count || 0, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}
