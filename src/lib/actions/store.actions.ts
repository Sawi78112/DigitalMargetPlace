"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { storeService, storeBlogService } from "@/lib/services";
import type {
  Store,
  StoreInsert,
  StoreUpdate,
  StoreBlog,
  StoreBlogInsert,
  StoreBlogUpdate,
} from "@/lib/types/database";

export async function createStore(data: StoreInsert) {
  try {
    const result = await storeService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/stores");
    revalidatePath("/admin/stores");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create store", success: false };
  }
}

export async function updateStore(id: string, data: StoreUpdate) {
  try {
    const result = await storeService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/stores");
    revalidatePath("/admin/stores");
    revalidatePath(`/stores/${id}`);

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update store", success: false };
  }
}

export async function deleteStore(id: string) {
  try {
    const result = await storeService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/stores");
    revalidatePath("/admin/stores");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete store", success: false };
  }
}

export async function getStore(id: string) {
  try {
    const result = await storeService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch store", success: false };
  }
}

export async function getStores(params?: {
  page?: number;
  limit?: number;
  userId?: string;
}) {
  try {
    const { page, limit, userId } = params || {};

    let result;
    if (userId) {
      result = await storeService.findByOwnerId(userId, { page, limit });
    } else {
      result = await storeService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch stores", success: false };
  }
}

export async function searchStores(
  query: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await storeService.searchStores(query, params);
    return result;
  } catch (error) {
    return { error: "Failed to search stores", success: false };
  }
}

export async function getStoreWithProducts(
  id: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await storeService.findWithProducts(id, params);
    return result;
  } catch (error) {
    return { error: "Failed to fetch store with products", success: false };
  }
}

export async function getStoreStats(id: string) {
  try {
    const result = await storeService.getStoreStats(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch store stats", success: false };
  }
}

export async function createStoreBlog(data: StoreBlogInsert) {
  try {
    const result = await storeBlogService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/stores/${data.store_id}/blog`);
    revalidatePath("/admin/blog");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create blog post", success: false };
  }
}

export async function updateStoreBlog(id: string, data: StoreBlogUpdate) {
  try {
    const result = await storeBlogService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    const blogPost = await storeBlogService.findById(id);
    if (blogPost.success && blogPost.data) {
      revalidatePath(`/stores/${blogPost.data.store_id}/blog`);
      revalidatePath(`/stores/${blogPost.data.store_id}/blog/${id}`);
    }
    revalidatePath("/admin/blog");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update blog post", success: false };
  }
}

export async function deleteStoreBlog(id: string) {
  try {
    const blogPost = await storeBlogService.findById(id);

    const result = await storeBlogService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (blogPost.success && blogPost.data) {
      revalidatePath(`/stores/${blogPost.data.store_id}/blog`);
    }
    revalidatePath("/admin/blog");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete blog post", success: false };
  }
}

export async function getStoreBlog(id: string) {
  try {
    const result = await storeBlogService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch blog post", success: false };
  }
}

export async function getStoreBlogPosts(
  storeId: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await storeBlogService.findByStoreId(storeId, params);
    return result;
  } catch (error) {
    return { error: "Failed to fetch blog posts", success: false };
  }
}

export async function getPublishedBlogPosts(
  storeId: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await storeBlogService.findPublishedBlogs(storeId, params);
    return result;
  } catch (error) {
    return { error: "Failed to fetch published blog posts", success: false };
  }
}

export async function getDraftBlogPosts(
  storeId: string,
  params?: { page?: number; limit?: number }
) {
  try {
    const result = await storeBlogService.findDraftBlogs(
      storeId,
      undefined,
      params
    );
    return result;
  } catch (error) {
    return { error: "Failed to fetch draft blog posts", success: false };
  }
}

export async function publishBlogPost(id: string) {
  try {
    const result = await storeBlogService.publishBlog(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    const blogPost = await storeBlogService.findById(id);
    if (blogPost.success && blogPost.data) {
      revalidatePath(`/stores/${blogPost.data.store_id}/blog`);
      revalidatePath(`/stores/${blogPost.data.store_id}/blog/${id}`);
    }
    revalidatePath("/admin/blog");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to publish blog post", success: false };
  }
}

export async function unpublishBlogPost(id: string) {
  try {
    const result = await storeBlogService.unpublishBlog(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    const blogPost = await storeBlogService.findById(id);
    if (blogPost.success && blogPost.data) {
      revalidatePath(`/stores/${blogPost.data.store_id}/blog`);
      revalidatePath(`/stores/${blogPost.data.store_id}/blog/${id}`);
    }
    revalidatePath("/admin/blog");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to unpublish blog post", success: false };
  }
}
