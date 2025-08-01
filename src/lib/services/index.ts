export { BaseService } from "./base.service";
export type {
  ServiceResponse,
  PaginationParams,
  PaginatedResponse,
} from "./base.service";

export { StorageService, storageService } from "./storage.service";
export type {
  StorageServiceResponse,
  UploadFileParams,
  UploadResult,
} from "./storage.service";

export {
  ProductService,
  ProductPhotoService,
  ProductCategoryService,
  productService,
  productPhotoService,
  productCategoryService,
} from "./product.service";

export {
  StoreService,
  StoreBlogService,
  storeService,
  storeBlogService,
} from "./store.service";

export { CategoryService, categoryService } from "./category.service";

export {
  CartService,
  CartItemService,
  cartService,
  cartItemService,
} from "./cart.service";

export {
  OrderService,
  OrderItemService,
  orderService,
  orderItemService,
} from "./order.service";
export {
  SalesAnalyticsService,
  CustomerActivityService,
  TaxInformationService,
  salesAnalyticsService,
  customerActivityService,
  taxInformationService,
} from "./analytics.service";

export type {
  Product,
  ProductPhoto,
  ProductCategory,
  Store,
  StoreBlog,
  Category,
  Cart,
  CartItem,
  Order,
  OrderItem,
  SalesAnalytics,
  CustomerActivity,
  TaxInformation,
  ProductInsert,
  ProductPhotoInsert,
  ProductCategoryInsert,
  StoreInsert,
  StoreBlogInsert,
  CategoryInsert,
  CartInsert,
  CartItemInsert,
  OrderInsert,
  OrderItemInsert,
  SalesAnalyticsInsert,
  CustomerActivityInsert,
  TaxInformationInsert,
  ProductUpdate,
  ProductPhotoUpdate,
  ProductCategoryUpdate,
  StoreUpdate,
  StoreBlogUpdate,
  CategoryUpdate,
  CartUpdate,
  CartItemUpdate,
  OrderUpdate,
  OrderItemUpdate,
  SalesAnalyticsUpdate,
  CustomerActivityUpdate,
  TaxInformationUpdate,
  ProductVisibility,
  OrderStatus,
  PhotoType,
} from "@/lib/types/database";
