"use server";

import { revalidatePath } from "next/cache";
import { cartService, cartItemService } from "@/lib/services";
import type {
  Cart,
  CartInsert,
  CartUpdate,
  CartItem,
  CartItemInsert,
  CartItemUpdate,
} from "@/lib/types/database";

export async function createCart(data: CartInsert) {
  try {
    const result = await cartService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to create cart", success: false };
  }
}

export async function updateCart(id: string, data: CartUpdate) {
  try {
    const result = await cartService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update cart", success: false };
  }
}

export async function deleteCart(id: string) {
  try {
    const result = await cartService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    return { error: "Failed to delete cart", success: false };
  }
}

export async function getCart(id: string) {
  try {
    const result = await cartService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch cart", success: false };
  }
}

export async function getUserCart(userId: string) {
  try {
    const result = await cartService.findByUserId(userId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch user cart", success: false };
  }
}

export async function getOrCreateUserCart(userId: string) {
  try {
    const result = await cartService.getOrCreateCart(userId);
    return result;
  } catch (error) {
    return { error: "Failed to get or create user cart", success: false };
  }
}

export async function getCartWithItems(userId: string) {
  try {
    const result = await cartService.findWithItems(userId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch cart with items", success: false };
  }
}

export async function getUserCartWithItems(userId: string) {
  try {
    const result = await cartService.findWithItems(userId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch user cart with items", success: false };
  }
}

export async function getCartTotal(userId: string) {
  try {
    const result = await cartService.getCartTotal(userId);
    return result;
  } catch (error) {
    return { error: "Failed to calculate cart total", success: false };
  }
}

export async function clearCart(userId: string) {
  try {
    const result = await cartService.clearCart(userId);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    return { error: "Failed to clear cart", success: false };
  }
}

export async function addItemToCart(data: CartItemInsert) {
  try {
    const result = await cartItemService.create(data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to add item to cart", success: false };
  }
}

export async function updateCartItem(id: string, data: CartItemUpdate) {
  try {
    const result = await cartItemService.update(id, data);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to update cart item", success: false };
  }
}

export async function removeItemFromCart(id: string) {
  try {
    const result = await cartItemService.delete(id);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    return { error: "Failed to remove item from cart", success: false };
  }
}

export async function getCartItem(id: string) {
  try {
    const result = await cartItemService.findById(id);
    return result;
  } catch (error) {
    return { error: "Failed to fetch cart item", success: false };
  }
}

export async function getCartItems(cartId: string) {
  try {
    const result = await cartItemService.findByCartId(cartId);
    return result;
  } catch (error) {
    return { error: "Failed to fetch cart items", success: false };
  }
}

export async function getCartItemsWithProducts(cartId: string) {
  try {
    const result = await cartItemService.findWithProductDetails(cartId);
    return result;
  } catch (error) {
    return {
      error: "Failed to fetch cart items with products",
      success: false,
    };
  }
}

export async function updateCartItemQuantity(
  cartId: string,
  productId: string,
  quantity: number
) {
  try {
    const result = await cartItemService.updateQuantity(
      cartId,
      productId,
      quantity
    );

    if (!result.success) {
      return result;
    }

    revalidatePath("/cart");

    return result;
  } catch (error) {
    return { error: "Failed to update cart item quantity", success: false };
  }
}

export async function addProductToCart(
  cartId: string,
  productId: string,
  quantity: number = 1
) {
  try {
    const result = await cartItemService.addToCart(cartId, productId, quantity);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { data: result.data, success: true };
  } catch (error) {
    return { error: "Failed to add product to cart", success: false };
  }
}

export async function removeProductFromCart(cartId: string, productId: string) {
  try {
    const result = await cartItemService.removeFromCart(cartId, productId);

    if (!result.success) {
      return { error: result.error, success: false };
    }

    revalidatePath("/cart");

    return { success: true };
  } catch (error) {
    return { error: "Failed to remove product from cart", success: false };
  }
}
