"use server";

import { revalidatePath } from "next/cache";
import { categoryService } from "@/lib/services";
import type {
  Category,
  CategoryInsert,
  CategoryUpdate,
} from "@/lib/types/database";

export async function createCategory(data: CategoryInsert) {
  try {
    const result = await categoryService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/categories");
    revalidatePath("/admin/categories");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create category", success: false };
  }
}

export async function updateCategory(id: string, data: CategoryUpdate) {
  try {
    const result = await categoryService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/categories");
    revalidatePath("/admin/categories");
    revalidatePath(`/categories/${id}`);

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update category", success: false };
  }
}

export async function deleteCategory(id: string) {
  try {
    const result = await categoryService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/categories");
    revalidatePath("/admin/categories");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete category", success: false };
  }
}

export async function getCategory(id: string) {
  try {
    const result = await categoryService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch category", success: false };
  }
}

export async function getCategories(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const { page, limit } = params || {};

    const result = await categoryService.findAll("*", { page, limit });
    return result;
  } catch (error) {
    return { error: "Failed to fetch categories", success: false };
  }
}

export async function getCategoriesOrdered() {
  try {
    const result = await categoryService.findAllOrdered();
    return result;
  } catch (error) {
    return { error: "Failed to fetch ordered categories", success: false };
  }
}

export async function getCategoriesWithProductCount(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const result = await categoryService.findWithProductCount(params);
    return result;
  } catch (error) {
    return {
      error: "Failed to fetch categories with product count",
      success: false,
    };
  }
}

export async function getCategoryWithProducts(
  id: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await categoryService.findWithProducts(id, params);
    return result;
  } catch (error) {
    return { error: "Failed to fetch category with products", success: false };
  }
}

export async function searchCategories(
  query: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await categoryService.searchCategories(query, params);
    return result;
  } catch (error) {
    return { error: "Failed to search categories", success: false };
  }
}

export async function getPopularCategories(limit: number = 10) {
  try {
    const result = await categoryService.findPopularCategories(limit);
    return result;
  } catch (error) {
    return { error: "Failed to fetch popular categories", success: false };
  }
}

export async function checkCategoryNameExists(
  name: string,
  excludeId?: string
) {
  try {
    const result = await categoryService.nameExists(name, excludeId);
    return result;
  } catch (error) {
    return { error: "Failed to check category name", success: false };
  }
}
