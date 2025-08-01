"use server";

import { revalidatePath } from "next/cache";
import {
  salesAnalyticsService,
  customerActivityService,
  taxInformationService,
} from "@/lib/services";
import type {
  SalesAnalytics,
  SalesAnalyticsInsert,
  SalesAnalyticsUpdate,
  CustomerActivity,
  CustomerActivityInsert,
  CustomerActivityUpdate,
  TaxInformation,
  TaxInformationInsert,
  TaxInformationUpdate,
} from "@/lib/types/database";

export async function createSalesAnalytics(data: SalesAnalyticsInsert) {
  try {
    const result = await salesAnalyticsService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create sales analytics", success: false };
  }
}

export async function updateSalesAnalytics(
  id: string,
  data: SalesAnalyticsUpdate
) {
  try {
    const result = await salesAnalyticsService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update sales analytics", success: false };
  }
}

export async function deleteSalesAnalytics(id: string) {
  try {
    const result = await salesAnalyticsService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete sales analytics", success: false };
  }
}

export async function getSalesAnalytics(params?: {
  page?: number;
  limit?: number;
  storeId?: string;
  sellerId?: string;
  buyerId?: string;
  productId?: string;
}) {
  try {
    const { page, limit, storeId, sellerId, buyerId, productId } = params || {};

    let result;
    if (storeId) {
      result = await salesAnalyticsService.findByStoreId(storeId, {
        page,
        limit,
      });
    } else if (sellerId) {
      result = await salesAnalyticsService.findBySellerId(sellerId, {
        page,
        limit,
      });
    } else if (buyerId) {
      result = await salesAnalyticsService.findByBuyerId(buyerId, {
        page,
        limit,
      });
    } else if (productId) {
      result = await salesAnalyticsService.findByProductId(productId, {
        page,
        limit,
      });
    } else {
      result = await salesAnalyticsService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch sales analytics", success: false };
  }
}

export async function getSalesAnalyticsById(id: string) {
  try {
    const result = await salesAnalyticsService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch sales analytics", success: false };
  }
}

export async function createCustomerActivity(data: CustomerActivityInsert) {
  try {
    const result = await customerActivityService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create customer activity", success: false };
  }
}

export async function updateCustomerActivity(
  id: string,
  data: CustomerActivityUpdate
) {
  try {
    const result = await customerActivityService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update customer activity", success: false };
  }
}

export async function deleteCustomerActivity(id: string) {
  try {
    const result = await customerActivityService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/analytics");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete customer activity", success: false };
  }
}

export async function getCustomerActivity(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  sessionId?: string;
  activityType?: string;
}) {
  try {
    const { page, limit, userId, sessionId, activityType } = params || {};

    let result;
    if (userId) {
      result = await customerActivityService.findByUserId(userId, {
        page,
        limit,
      });
    } else if (sessionId) {
      result = await customerActivityService.findBySessionId(sessionId, {
        page,
        limit,
      });
    } else if (activityType) {
      result = await customerActivityService.findByActivityType(activityType, {
        page,
        limit,
      });
    } else {
      result = await customerActivityService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch customer activity", success: false };
  }
}

export async function getCustomerActivityById(id: string) {
  try {
    const result = await customerActivityService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch customer activity", success: false };
  }
}

export async function createTaxInformation(data: TaxInformationInsert) {
  try {
    const result = await taxInformationService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/tax");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create tax information", success: false };
  }
}

export async function updateTaxInformation(
  id: string,
  data: TaxInformationUpdate
) {
  try {
    const result = await taxInformationService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/tax");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update tax information", success: false };
  }
}

export async function deleteTaxInformation(id: string) {
  try {
    const result = await taxInformationService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/admin/tax");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete tax information", success: false };
  }
}

export async function getTaxInformation(params?: {
  page?: number;
  limit?: number;
  userId?: string;
  country?: string;
}) {
  try {
    const { page, limit, userId, country } = params || {};

    let result;
    if (userId) {
      result = await taxInformationService.findByUserId(userId);
    } else if (country) {
      result = await taxInformationService.findByCountry(country, {
        page,
        limit,
      });
    } else {
      result = await taxInformationService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch tax information", success: false };
  }
}

export async function getTaxInformationById(id: string) {
  try {
    const result = await taxInformationService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch tax information", success: false };
  }
}
