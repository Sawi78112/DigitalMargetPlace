"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { orderService, orderItemService } from "@/lib/services";
import type {
  Order,
  OrderInsert,
  OrderUpdate,
  OrderItem,
  OrderItemInsert,
  OrderItemUpdate,
  OrderStatus,
} from "@/lib/types/database";

export async function createOrder(data: OrderInsert) {
  try {
    const result = await orderService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create order", success: false };
  }
}

export async function updateOrder(id: string, data: OrderUpdate) {
  try {
    const result = await orderService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${id}`);

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update order", success: false };
  }
}

export async function deleteOrder(id: string) {
  try {
    const result = await orderService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/orders");
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete order", success: false };
  }
}

export async function getOrder(id: string) {
  try {
    const result = await orderService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch order", success: false };
  }
}

export async function getOrders(params?: {
  page?: number;
  limit?: number;
  buyerId?: string;
  sellerId?: string;
  status?: OrderStatus;
}) {
  try {
    const { page, limit, buyerId, sellerId, status } = params || {};

    let result;
    if (buyerId) {
      result = await orderService.findByBuyerId(buyerId, { page, limit });
    } else if (sellerId) {
      result = await orderService.findBySellerId(sellerId, { page, limit });
    } else if (status) {
      result = await orderService.findByStatus(status, { page, limit });
    } else {
      result = await orderService.findAll("*", { page, limit });
    }

    return result;
  } catch (error) {
    return { error: "Failed to fetch orders", success: false };
  }
}

export async function getOrderWithItems(id: string) {
  try {
    const result = await orderService.findWithItems(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch order with items", success: false };
  }
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  try {
    const result = await orderService.updateStatus(id, status);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/orders");
    revalidatePath("/admin/orders");
    revalidatePath(`/orders/${id}`);

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update order status", success: false };
  }
}

export async function getOrderStats(startDate?: string, endDate?: string) {
  try {
    const result = await orderService.getOrderStats(startDate, endDate);
    return result;
  } catch (error) {
    return { error: "Failed to fetch order stats", success: false };
  }
}

export async function createOrderFromCart(buyerId: string, cartItems: any[]) {
  try {
    const result = await orderService.createOrderFromCart(buyerId, cartItems);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/orders");
    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create order from cart", success: false };
  }
}

export async function addOrderItem(data: OrderItemInsert) {
  try {
    const result = await orderItemService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath(`/orders/${data.order_id}`);
    revalidatePath("/admin/orders");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to add order item", success: false };
  }
}

export async function updateOrderItem(id: string, data: OrderItemUpdate) {
  try {
    const result = await orderItemService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    const orderItem = await orderItemService.findById(id);
    if (orderItem.success && orderItem.data) {
      revalidatePath(`/orders/${orderItem.data.order_id}`);
    }
    revalidatePath("/admin/orders");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update order item", success: false };
  }
}

export async function removeOrderItem(id: string) {
  try {
    const orderItem = await orderItemService.findById(id);

    const result = await orderItemService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    if (orderItem.success && orderItem.data) {
      revalidatePath(`/orders/${orderItem.data.order_id}`);
    }
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    return { error: "Failed to remove order item", success: false };
  }
}

export async function getOrderItem(id: string) {
  try {
    const result = await orderItemService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch order item", success: false };
  }
}

export async function getOrderItems(orderId: string) {
  try {
    const result = await orderItemService.findByOrderId(orderId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch order items", success: false };
  }
}

export async function getOrderItemsWithProducts(orderId: string) {
  try {
    const result = await orderItemService.findWithDownloadStatus(orderId);
    return result;
  } catch (error) {
    return {
      error: "Failed to fetch order items with products",
      success: false,
    };
  }
}
