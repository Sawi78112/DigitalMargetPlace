import { BaseService } from "./base.service";
import {
  Order,
  OrderInsert,
  OrderUpdate,
  OrderItem,
  OrderItemInsert,
  OrderItemUpdate,
  OrderStatus,
} from "@/lib/types/database";

export class OrderService extends BaseService<Order, OrderInsert, OrderUpdate> {
  constructor() {
    super("orders");
  }

  /**
   * Find orders by buyer ID
   */
  async findByBuyerId(
    buyerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("buyer_id", buyerId, "*", pagination);
  }

  /**
   * Find orders by status
   */
  async findByStatus(
    status: OrderStatus,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("status", status, "*", pagination);
  }

  /**
   * Find orders by order number
   */
  async findByOrderNumber(orderNumber: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("order_number", orderNumber)
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as Order, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Generate unique order number
   */
  generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create order with items from cart
   */
  async createOrderFromCart(
    buyerId: string,
    cartItems: any[],
    paymentMethod?: string,
    buyerNotes?: string
  ) {
    try {
      const supabase = await this.getClient();

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => {
        return sum + Number(item.products.price) * item.quantity;
      }, 0);

      // Create order
      const orderData: OrderInsert = {
        order_number: this.generateOrderNumber(),
        buyer_id: buyerId,
        total_amount: totalAmount,
        payment_method: paymentMethod,
        buyer_notes: buyerNotes,
        status: "pending",
      };

      const { data: order, error: orderError } = await supabase
        .from(this.tableName)
        .insert(orderData)
        .select()
        .single();

      if (orderError) {
        return { error: orderError, success: false };
      }

      // Create order items
      const orderItems: OrderItemInsert[] = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        store_id: item.products.stores.id,
        seller_id: item.products.stores.owner_id, // Assuming store has owner_id
        product_title: item.products.title,
        product_description: item.products.description,
        unit_price: Number(item.products.price),
        quantity: item.quantity,
        total_price: Number(item.products.price) * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        // Rollback order creation
        await supabase.from(this.tableName).delete().eq("id", order.id);
        return { error: itemsError, success: false };
      }

      return { data: order as Order, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Update order status
   */
  async updateStatus(
    orderId: string,
    status: OrderStatus,
    adminNotes?: string
  ) {
    const updateData: OrderUpdate = { status };

    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    if (status === "completed") {
      updateData.payment_completed_at = new Date().toISOString();
    }

    return this.update(orderId, updateData);
  }

  /**
   * Mark order as paid
   */
  async markAsPaid(
    orderId: string,
    transactionId: string,
    paymentMethod: string
  ) {
    return this.update(orderId, {
      status: "processing",
      payment_transaction_id: transactionId,
      payment_method: paymentMethod,
      payment_completed_at: new Date().toISOString(),
    });
  }

  /**
   * Get order with items and product details
   */
  async findWithItems(orderId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          order_items (
            id,
            product_id,
            store_id,
            seller_id,
            product_title,
            product_description,
            unit_price,
            quantity,
            total_price,
            download_url,
            download_expires_at,
            download_count,
            max_downloads,
            created_at,
            products (
              id,
              title,
              storage_path,
              visibility
            ),
            stores (
              id,
              name
            )
          )
        `
        )
        .eq("id", orderId)
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
   * Get orders for a seller (store owner)
   */
  async findBySellerId(
    sellerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from("order_items")
        .select(
          `
          order_id,
          orders (
            id,
            order_number,
            buyer_id,
            total_amount,
            status,
            payment_method,
            payment_completed_at,
            buyer_notes,
            admin_notes,
            created_at,
            updated_at
          )
        `,
          { count: "exact" }
        )
        .eq("seller_id", sellerId)
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

      // Extract unique orders
      const orderMap = new Map();
      data.forEach((item: any) => {
        if (item.orders && !orderMap.has(item.orders.id)) {
          orderMap.set(item.orders.id, item.orders);
        }
      });

      const orders = Array.from(orderMap.values());

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
          data: orders,
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
   * Get order statistics for date range
   */
  async getOrderStats(startDate?: string, endDate?: string) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("status, total_amount, created_at");

      if (startDate) {
        query = query.gte("created_at", startDate);
      }
      if (endDate) {
        query = query.lte("created_at", endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      const stats = {
        totalOrders: data.length,
        totalRevenue: data.reduce(
          (sum, order) => sum + Number(order.total_amount),
          0
        ),
        ordersByStatus: data.reduce((acc: any, order) => {
          acc[order.status] = (acc[order.status] || 0) + 1;
          return acc;
        }, {}),
        averageOrderValue:
          data.length > 0
            ? data.reduce((sum, order) => sum + Number(order.total_amount), 0) /
              data.length
            : 0,
      };

      return { data: stats, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export class OrderItemService extends BaseService<
  OrderItem,
  OrderItemInsert,
  OrderItemUpdate
> {
  constructor() {
    super("order_items");
  }

  /**
   * Find items by order ID
   */
  async findByOrderId(
    orderId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("order_id", orderId, "*", pagination);
  }

  /**
   * Find items by seller ID
   */
  async findBySellerId(
    sellerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("seller_id", sellerId, "*", pagination);
  }

  /**
   * Find items by store ID
   */
  async findByStoreId(
    storeId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("store_id", storeId, "*", pagination);
  }

  /**
   * Generate download URL for order item
   */
  async generateDownloadUrl(orderItemId: string, expiresInHours: number = 24) {
    try {
      const supabase = await this.getClient();

      // Get order item with product details
      const { data: orderItem, error: itemError } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          products (storage_path),
          orders (status)
        `
        )
        .eq("id", orderItemId)
        .single();

      if (itemError) {
        return { error: itemError, success: false };
      }

      // Check if order is completed
      if (orderItem.orders.status !== "completed") {
        return {
          error: "Order must be completed to generate download link",
          success: false,
        };
      }

      // Check download limits
      if (
        orderItem.max_downloads &&
        orderItem.download_count >= orderItem.max_downloads
      ) {
        return { error: "Download limit exceeded", success: false };
      }

      // Check if download URL is still valid
      if (orderItem.download_url && orderItem.download_expires_at) {
        const expiresAt = new Date(orderItem.download_expires_at);
        if (expiresAt > new Date()) {
          return { data: orderItem.download_url, success: true };
        }
      }

      // Generate new signed URL
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + expiresInHours);

      const { data: signedUrl, error: urlError } = await supabase.storage
        .from("products")
        .createSignedUrl(
          orderItem.products.storage_path,
          expiresInHours * 3600
        );

      if (urlError) {
        return { error: urlError, success: false };
      }

      // Update order item with new download URL
      const { data: updatedItem, error: updateError } = await supabase
        .from(this.tableName)
        .update({
          download_url: signedUrl.signedUrl,
          download_expires_at: expiresAt.toISOString(),
        })
        .eq("id", orderItemId)
        .select()
        .single();

      if (updateError) {
        return { error: updateError, success: false };
      }

      return { data: signedUrl.signedUrl, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Track download
   */
  async trackDownload(orderItemId: string) {
    try {
      const supabase = await this.getClient();

      // Get current download count
      const { data: orderItem, error: itemError } = await supabase
        .from(this.tableName)
        .select("download_count, max_downloads")
        .eq("id", orderItemId)
        .single();

      if (itemError) {
        return { error: itemError, success: false };
      }

      // Check download limits
      const currentCount = orderItem.download_count || 0;
      if (orderItem.max_downloads && currentCount >= orderItem.max_downloads) {
        return { error: "Download limit exceeded", success: false };
      }

      // Increment download count
      const { error: updateError } = await supabase
        .from(this.tableName)
        .update({ download_count: currentCount + 1 })
        .eq("id", orderItemId);

      if (updateError) {
        return { error: updateError, success: false };
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
   * Get order items with download status
   */
  async findWithDownloadStatus(
    buyerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          *,
          orders!inner (
            id,
            order_number,
            status,
            buyer_id
          ),
          products (
            id,
            title,
            storage_path
          ),
          stores (
            id,
            name
          )
        `,
          { count: "exact" }
        )
        .eq("orders.buyer_id", buyerId)
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

      // Add download status to each item
      const itemsWithStatus = data.map((item: any) => ({
        ...item,
        canDownload:
          item.orders.status === "completed" &&
          (!item.max_downloads || item.download_count < item.max_downloads),
        downloadExpired: item.download_expires_at
          ? new Date(item.download_expires_at) < new Date()
          : false,
      }));

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
          data: itemsWithStatus,
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

export const orderService = new OrderService();
export const orderItemService = new OrderItemService();
