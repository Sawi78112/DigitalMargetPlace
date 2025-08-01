"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  productService,
  productPhotoService,
  productCategoryService,
} from "@/lib/services";
import type {
  Product,
  ProductInsert,
  ProductUpdate,
  ProductPhoto,
  ProductPhotoInsert,
  ProductCategory,
  ProductCategoryInsert,
  ProductVisibility,
} from "@/lib/types/database";

export async function createProduct(data: ProductInsert) {
  try {
    const result = await productService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create product", success: false };
  }
}

export async function updateProduct(id: string, data: ProductUpdate) {
  try {
    const result = await productService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/products");
    revalidatePath("/admin/products");
    revalidatePath(`/products/${id}`);

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update product", success: false };
  }
}

export async function deleteProduct(id: string) {
  try {
    const result = await productService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/products");
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product", success: false };
  }
}

export async function getProduct(id: string) {
  try {
    const result = await productService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch product", success: false };
  }
}

export async function getProducts(params?: {
  page?: number;
  limit?: number;
  storeId?: string;
  visibility?: ProductVisibility;
}) {
  try {
    const { page, limit, storeId, visibility } = params || {};

    let result;
    if (storeId) {
      result = await productService.findByStoreId(storeId, { page, limit });
    } else if (visibility) {
      result = await productService.findByVisibility(visibility, {
        page,
        limit,
      });
    } else {
      result = await productService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch products", success: false };
  }
}

export async function getVisibleProducts(params?: {
  page?: number;
  limit?: number;
}) {
  try {
    const result = await productService.findVisibleProducts(params);
    return result;
  } catch (error) {
    return { error: "Failed to fetch visible products", success: false };
  }
}

export async function searchProducts(
  query: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await productService.searchProducts(query, params);
    return result;
  } catch (error) {
    return { error: "Failed to search products", success: false };
  }
}

export async function incrementProductDownloads(id: string) {
  try {
    const result = await productService.incrementDownloadCount(id);

    if (!result.success) {
      return result;
    }

    revalidatePath(`/products/${id}`);

    return result;
  } catch (error) {
    return { error: "Failed to increment download count", success: false };
  }
}

export async function addProductPhoto(data: ProductPhotoInsert) {
  try {
    const result = await productPhotoService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/products/${data.product_id}`);
    revalidatePath("/admin/products");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to add product photo", success: false };
  }
}

export async function deleteProductPhoto(id: string, productId: string) {
  try {
    const result = await productPhotoService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/admin/products");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete product photo", success: false };
  }
}

export async function getProductPhotos(productId: string) {
  try {
    const result = await productPhotoService.findByProductId(productId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch product photos", success: false };
  }
}

export async function addProductToCategory(data: ProductCategoryInsert) {
  try {
    const result = await productCategoryService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/products/${data.product_id}`);
    revalidatePath("/categories");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to add product to category", success: false };
  }
}

export async function removeProductFromCategory(id: string, productId: string) {
  try {
    const result = await productCategoryService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/products/${productId}`);
    revalidatePath("/categories");

    return { success: true };
  } catch (error) {
    return { error: "Failed to remove product from category", success: false };
  }
}

export async function getProductCategories(productId: string) {
  try {
    const result = await productCategoryService.findByProductId(productId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch product categories", success: false };
  }
}
