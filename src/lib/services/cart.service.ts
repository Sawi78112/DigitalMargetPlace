import { BaseService } from "./base.service";
import {
  Cart,
  CartInsert,
  CartUpdate,
  CartItem,
  CartItemInsert,
  CartItemUpdate,
} from "@/lib/types/database";

export class CartService extends BaseService<Cart, CartInsert, CartUpdate> {
  constructor() {
    super("carts");
  }

  /**
   * Find cart by user ID
   */
  async findByUserId(userId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as Cart, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get cart with items and product details
   */
  async findWithItems(userId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select(
          `
          *,
          cart_items (
            id,
            quantity,
            added_at,
            products (
              id,
              title,
              description,
              price,
              storage_path,
              visibility,
              stores (
                id,
                name
              )
            )
          )
        `
        )
        .eq("user_id", userId)
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
   * Get or create cart for user
   */
  async getOrCreateCart(userId: string) {
    const cartResult = await this.findByUserId(userId);

    if (cartResult.success && cartResult.data) {
      return cartResult;
    }

    return this.create({ user_id: userId });
  }

  /**
   * Get cart total amount
   */
  async getCartTotal(userId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from("cart_items")
        .select(
          `
          quantity,
          products (price)
        `
        )
        .eq("carts.user_id", userId);

      if (error) {
        return { error, success: false };
      }

      const total = data.reduce((sum, item: any) => {
        return sum + Number(item.products.price) * item.quantity;
      }, 0);

      return { data: total, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Clear cart (remove all items)
   */
  async clearCart(userId: string) {
    try {
      const supabase = await this.getClient();

      const cartResult = await this.findByUserId(userId);
      if (!cartResult.success || !cartResult.data) {
        return { error: "Cart not found", success: false };
      }

      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("cart_id", cartResult.data.id);

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
}

export class CartItemService extends BaseService<
  CartItem,
  CartItemInsert,
  CartItemUpdate
> {
  constructor() {
    super("cart_items");
  }

  /**
   * Find items by cart ID
   */
  async findByCartId(
    cartId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("cart_id", cartId, "*", pagination);
  }

  /**
   * Find cart item by cart and product
   */
  async findByCartAndProduct(cartId: string, productId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as CartItem, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Add product to cart or update quantity if exists
   */
  async addToCart(cartId: string, productId: string, quantity: number = 1) {
    try {
      // Check if item already exists
      const existingItem = await this.findByCartAndProduct(cartId, productId);

      if (existingItem.success && existingItem.data) {
        // Update existing item quantity
        const newQuantity = existingItem.data.quantity + quantity;
        return this.update(existingItem.data.id, { quantity: newQuantity });
      } else {
        // Create new cart item
        return this.create({
          cart_id: cartId,
          product_id: productId,
          quantity,
        });
      }
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Update cart item quantity
   */
  async updateQuantity(cartId: string, productId: string, quantity: number) {
    try {
      const supabase = await this.getClient();

      if (quantity <= 0) {
        // Remove item if quantity is 0 or negative
        return this.removeFromCart(cartId, productId);
      }

      const { data, error } = await supabase
        .from(this.tableName)
        .update({ quantity })
        .eq("cart_id", cartId)
        .eq("product_id", productId)
        .select()
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as CartItem, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Remove product from cart
   */
  async removeFromCart(cartId: string, productId: string) {
    try {
      const supabase = await this.getClient();

      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("cart_id", cartId)
        .eq("product_id", productId);

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
   * Get cart items with product details
   */
  async findWithProductDetails(
    cartId: string,
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
            storage_path,
            visibility,
            stores (
              id,
              name
            )
          )
        `,
          { count: "exact" }
        )
        .eq("cart_id", cartId)
        .order("added_at", { ascending: false });

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
   * Get cart item count for a cart
   */
  async getCartItemCount(cartId: string) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("quantity")
        .eq("cart_id", cartId);

      if (error) {
        return { error, success: false };
      }

      const totalItems = data.reduce((sum, item) => sum + item.quantity, 0);

      return { data: totalItems, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export const cartService = new CartService();
export const cartItemService = new CartItemService();
