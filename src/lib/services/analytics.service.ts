import { BaseService } from "./base.service";
import {
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

export class SalesAnalyticsService extends BaseService<
  SalesAnalytics,
  SalesAnalyticsInsert,
  SalesAnalyticsUpdate
> {
  constructor() {
    super("sales_analytics");
  }

  /**
   * Find analytics by seller ID
   */
  async findBySellerId(
    sellerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("seller_id", sellerId, "*", pagination);
  }

  /**
   * Find analytics by buyer ID
   */
  async findByBuyerId(
    buyerId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("buyer_id", buyerId, "*", pagination);
  }

  /**
   * Find analytics by store ID
   */
  async findByStoreId(
    storeId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("store_id", storeId, "*", pagination);
  }

  /**
   * Find analytics by product ID
   */
  async findByProductId(
    productId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("product_id", productId, "*", pagination);
  }

  /**
   * Create analytics record from order
   */
  async createFromOrder(orderData: {
    orderId: string;
    productId: string;
    sellerId: string;
    buyerId: string;
    storeId: string;
    grossAmount: number;
    platformFeeRate?: number;
    buyerCountry?: string;
    trafficSource?: string;
  }) {
    const platformFee =
      orderData.grossAmount * (orderData.platformFeeRate || 0.1); // 10% default platform fee
    const sellerEarnings = orderData.grossAmount - platformFee;

    const analyticsData: SalesAnalyticsInsert = {
      order_id: orderData.orderId,
      product_id: orderData.productId,
      seller_id: orderData.sellerId,
      buyer_id: orderData.buyerId,
      store_id: orderData.storeId,
      gross_amount: orderData.grossAmount,
      platform_fee: platformFee,
      seller_earnings: sellerEarnings,
      buyer_country: orderData.buyerCountry,
      traffic_source: orderData.trafficSource,
    };

    return this.create(analyticsData);
  }

  /**
   * Get seller revenue analytics
   */
  async getSellerRevenue(
    sellerId: string,
    startDate?: string,
    endDate?: string,
    groupBy: "day" | "week" | "month" = "day"
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("sale_date, gross_amount, platform_fee, seller_earnings")
        .eq("seller_id", sellerId)
        .order("sale_date", { ascending: true });

      if (startDate) {
        query = query.gte("sale_date", startDate);
      }
      if (endDate) {
        query = query.lte("sale_date", endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      // Group data by specified period
      const groupedData = this.groupSalesByPeriod(data, groupBy);

      const summary = {
        totalGrossRevenue: data.reduce(
          (sum, record) => sum + Number(record.gross_amount),
          0
        ),
        totalPlatformFees: data.reduce(
          (sum, record) => sum + Number(record.platform_fee || 0),
          0
        ),
        totalSellerEarnings: data.reduce(
          (sum, record) => sum + Number(record.seller_earnings),
          0
        ),
        totalSales: data.length,
        dailyData: groupedData,
      };

      return { data: summary, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get product performance analytics
   */
  async getProductPerformance(
    productId?: string,
    storeId?: string,
    startDate?: string,
    endDate?: string,
    limit: number = 10
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select(
          `
          product_id,
          gross_amount,
          platform_fee,
          seller_earnings,
          sale_date,
          products (
            id,
            title,
            price
          )
        `
        )
        .order("gross_amount", { ascending: false });

      if (productId) {
        query = query.eq("product_id", productId);
      }
      if (storeId) {
        query = query.eq("store_id", storeId);
      }
      if (startDate) {
        query = query.gte("sale_date", startDate);
      }
      if (endDate) {
        query = query.lte("sale_date", endDate);
      }

      query = query.limit(limit);

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      // Aggregate by product
      const productStats: { [key: string]: any } = {};

      data.forEach((record: any) => {
        const productId = record.product_id;
        if (!productStats[productId]) {
          productStats[productId] = {
            product: record.products,
            totalRevenue: 0,
            totalSales: 0,
            totalEarnings: 0,
          };
        }

        productStats[productId].totalRevenue += Number(record.gross_amount);
        productStats[productId].totalSales += 1;
        productStats[productId].totalEarnings += Number(record.seller_earnings);
      });

      const sortedProducts = Object.values(productStats).sort(
        (a: any, b: any) => b.totalRevenue - a.totalRevenue
      );

      return { data: sortedProducts, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get geographic sales analytics
   */
  async getGeographicAnalytics(
    sellerId?: string,
    storeId?: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("buyer_country, gross_amount")
        .not("buyer_country", "is", null);

      if (sellerId) {
        query = query.eq("seller_id", sellerId);
      }
      if (storeId) {
        query = query.eq("store_id", storeId);
      }
      if (startDate) {
        query = query.gte("sale_date", startDate);
      }
      if (endDate) {
        query = query.lte("sale_date", endDate);
      }

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      // Group by country
      const countryStats: {
        [key: string]: { revenue: number; sales: number };
      } = {};

      data.forEach((record: any) => {
        const country = record.buyer_country;
        if (!countryStats[country]) {
          countryStats[country] = { revenue: 0, sales: 0 };
        }
        countryStats[country].revenue += Number(record.gross_amount);
        countryStats[country].sales += 1;
      });

      const sortedCountries = Object.entries(countryStats)
        .map(([country, stats]) => ({ country, ...stats }))
        .sort((a, b) => b.revenue - a.revenue);

      return { data: sortedCountries, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Group sales by time period
   */
  private groupSalesByPeriod(data: any[], groupBy: "day" | "week" | "month") {
    const grouped: {
      [key: string]: { revenue: number; sales: number; earnings: number };
    } = {};

    data.forEach((record) => {
      const date = new Date(record.sale_date);
      let key: string;

      switch (groupBy) {
        case "day":
          key = date.toISOString().split("T")[0];
          break;
        case "week":
          const weekStart = new Date(
            date.setDate(date.getDate() - date.getDay())
          );
          key = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
      }

      if (!grouped[key]) {
        grouped[key] = { revenue: 0, sales: 0, earnings: 0 };
      }

      grouped[key].revenue += Number(record.gross_amount);
      grouped[key].sales += 1;
      grouped[key].earnings += Number(record.seller_earnings);
    });

    return Object.entries(grouped)
      .map(([period, stats]) => ({ period, ...stats }))
      .sort((a, b) => a.period.localeCompare(b.period));
  }
}

export class CustomerActivityService extends BaseService<
  CustomerActivity,
  CustomerActivityInsert,
  CustomerActivityUpdate
> {
  constructor() {
    super("customer_activities");
  }

  /**
   * Track user activity
   */
  async trackActivity(
    sessionId: string,
    activityType: string,
    userId?: string,
    resourceType?: string,
    resourceId?: string,
    metadata?: any,
    request?: Request
  ) {
    const activityData: CustomerActivityInsert = {
      user_id: userId,
      session_id: sessionId,
      activity_type: activityType,
      resource_type: resourceType,
      resource_id: resourceId,
      metadata,
    };

    // Extract request information if available
    if (request) {
      activityData.ip_address =
        request.headers.get("x-forwarded-for") ||
        request.headers.get("x-real-ip") ||
        "unknown";
      activityData.user_agent = request.headers.get("user-agent");
      activityData.referrer = request.headers.get("referer");
    }

    return this.create(activityData);
  }

  /**
   * Find activities by user ID
   */
  async findByUserId(
    userId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("user_id", userId, "*", pagination);
  }

  /**
   * Find activities by session ID
   */
  async findBySessionId(
    sessionId: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("session_id", sessionId, "*", pagination);
  }

  /**
   * Find activities by type
   */
  async findByActivityType(
    activityType: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("activity_type", activityType, "*", pagination);
  }

  /**
   * Get user activity summary
   */
  async getUserActivitySummary(userId: string, days: number = 30) {
    try {
      const supabase = await this.getClient();

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from(this.tableName)
        .select("activity_type, created_at")
        .eq("user_id", userId)
        .gte("created_at", startDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) {
        return { error, success: false };
      }

      // Group by activity type
      const activityCount: { [key: string]: number } = {};
      data.forEach((activity) => {
        activityCount[activity.activity_type] =
          (activityCount[activity.activity_type] || 0) + 1;
      });

      const summary = {
        totalActivities: data.length,
        activityTypes: activityCount,
        lastActivity: data[0]?.created_at || null,
        periodDays: days,
      };

      return { data: summary, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Get popular resources
   */
  async getPopularResources(
    resourceType: string,
    limit: number = 10,
    days?: number
  ) {
    try {
      const supabase = await this.getClient();

      let query = supabase
        .from(this.tableName)
        .select("resource_id")
        .eq("resource_type", resourceType)
        .not("resource_id", "is", null);

      if (days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        query = query.gte("created_at", startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) {
        return { error, success: false };
      }

      // Count resource interactions
      const resourceCount: { [key: string]: number } = {};
      data.forEach((activity) => {
        const resourceId = activity.resource_id;
        resourceCount[resourceId] = (resourceCount[resourceId] || 0) + 1;
      });

      const popularResources = Object.entries(resourceCount)
        .map(([resourceId, count]) => ({ resourceId, viewCount: count }))
        .sort((a, b) => b.viewCount - a.viewCount)
        .slice(0, limit);

      return { data: popularResources, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export class TaxInformationService extends BaseService<
  TaxInformation,
  TaxInformationInsert,
  TaxInformationUpdate
> {
  constructor() {
    super("tax_information");
  }

  /**
   * Find tax information by user ID
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

      return { data: data as TaxInformation, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Create or update tax information for user
   */
  async upsertByUserId(
    userId: string,
    taxData: Omit<TaxInformationInsert, "user_id">
  ) {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .upsert({
          ...taxData,
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        return { error, success: false };
      }

      return { data: data as TaxInformation, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }

  /**
   * Find users by country
   */
  async findByCountry(
    country: string,
    pagination?: { page?: number; limit?: number }
  ) {
    return this.findBy("country", country, "*", pagination);
  }

  /**
   * Get newsletter subscribers
   */
  async getNewsletterSubscribers(pagination?: {
    page?: number;
    limit?: number;
  }) {
    return this.findBy("enabled_newsletter", true, "*", pagination);
  }

  /**
   * Get country statistics
   */
  async getCountryStats() {
    try {
      const supabase = await this.getClient();

      const { data, error } = await supabase
        .from(this.tableName)
        .select("country");

      if (error) {
        return { error, success: false };
      }

      // Count users by country
      const countryCount: { [key: string]: number } = {};
      data.forEach((record) => {
        countryCount[record.country] = (countryCount[record.country] || 0) + 1;
      });

      const sortedCountries = Object.entries(countryCount)
        .map(([country, count]) => ({ country, userCount: count }))
        .sort((a, b) => b.userCount - a.userCount);

      return { data: sortedCountries, success: true };
    } catch (error) {
      return {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
        success: false,
      };
    }
  }
}

export const salesAnalyticsService = new SalesAnalyticsService();
export const customerActivityService = new CustomerActivityService();
export const taxInformationService = new TaxInformationService();
