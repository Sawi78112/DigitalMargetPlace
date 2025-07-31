// src/lib/api.ts
import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const dev = process.env.NODE_ENV !== "production";

// Use real API from environment variable - match Svelte exactly
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// Real authentication - no mock
const MOCK_AUTH = false;

// ----------------------------
// 1. Type Definitions
// ----------------------------
export interface ApiError {
  message: string;
  status: number;
  errors?: string[];
  fieldErrors?: Record<string, string>;
}

export interface User {
  id: number;
  email: string;
  name: string;
  verified_at: string | null;
}

type ApiConfig = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
  token?: string;
  isFormData?: boolean;
};

// ----------------------------
// 2. Axios Instance
// ----------------------------
const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  // Remove default Content-Type header to allow dynamic setting
});

// ----------------------------
// 3. Request Interceptor (Auth)
// ----------------------------
client.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type based on data type
  if (!config.headers["Content-Type"]) {
    if (config.data instanceof FormData) {
      // Let the browser set Content-Type for FormData (including boundary)
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }
  }

  return config;
});

// ----------------------------
// 4. Response Interceptor (Error Handling)
// ----------------------------
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      Cookies.remove("token");
    }

    // Transform to ApiError format
    const apiError: ApiError = {
      message: error.message,
      status: error.response?.status || 0,
      errors: [],
      fieldErrors: {},
    };

    if (error.response?.data) {
      const data = error.response.data as Record<string, unknown>;
      apiError.message = (data.error as string) || apiError.message;
      apiError.errors = data.errors as string[];
      apiError.fieldErrors = data.field_errors as Record<string, string>;
    }

    throw apiError;
  }
);

// ----------------------------
// 5. Core API Function
// ----------------------------
export async function api<TResponse>(config: ApiConfig): Promise<TResponse> {
  const { method, url, data, params, token, isFormData } = config;

  // Prepare headers
  const headers: Record<string, string> = {};

  // Use explicit token if provided
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Set Content-Type based on data type
  if (data instanceof FormData || isFormData) {
    // Don't set Content-Type for FormData - let browser handle it
    // This ensures proper boundary is set for multipart/form-data
  } else {
    headers["Content-Type"] = "application/json";
  }

  try {
    const response = await client.request<TResponse>({
      method,
      url,
      data,
      params,
      headers: Object.keys(headers).length > 0 ? headers : undefined,
    });

    return response.data;
  } catch (error) {
    // Already transformed to ApiError by interceptor
    throw error as ApiError;
  }
}

// ----------------------------
// 6. Form Data Utilities
// ----------------------------
export const formData = {
  /**
   * Create FormData from an object
   * Handles nested objects and arrays properly
   * @param data - The data object to convert
   * @param options - Formatting options
   * @param options.arrayFormat - How to format arrays: 'brackets' (key[0]), 'repeat' (key, key), 'comma' (key=val1,val2)
   */
  create: (
    data: Record<string, unknown>,
    options: { arrayFormat?: "brackets" | "repeat" | "comma" } = {}
  ): FormData => {
    const { arrayFormat = "repeat" } = options;
    const form = new FormData();

    const appendToForm = (key: string, value: unknown) => {
      if (value === null || value === undefined) {
        return;
      }

      if (value instanceof File || value instanceof Blob) {
        form.append(key, value);
      } else if (Array.isArray(value)) {
        if (arrayFormat === "brackets") {
          // Format: categories[0], categories[1]
          value.forEach((item, index) => {
            appendToForm(`${key}[${index}]`, item);
          });
        } else if (arrayFormat === "comma") {
          // Format: categories = "item1,item2,item3"
          form.append(key, value.join(","));
        } else {
          value.forEach((item) => {
            if (item instanceof File || item instanceof Blob) {
              form.append(key, item);
            } else {
              form.append(key, String(item));
            }
          });
        }
      } else if (typeof value === "object") {
        Object.entries(value as Record<string, unknown>).forEach(
          ([nestedKey, nestedValue]) => {
            appendToForm(`${key}[${nestedKey}]`, nestedValue);
          }
        );
      } else {
        form.append(key, String(value));
      }
    };

    Object.entries(data).forEach(([key, value]) => {
      appendToForm(key, value);
    });

    return form;
  },

  /**
   * Convert FormData to object for debugging
   */
  toObject: (form: FormData): Record<string, unknown> => {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of form.entries()) {
      obj[key] = value;
    }
    return obj;
  },
};

// ----------------------------
// 7. Auth Utilities
// ----------------------------
export const auth = {
  setToken: (token: string, expires?: Date) =>
    Cookies.set("token", token, {
      secure: !dev,
      sameSite: "strict",
      httpOnly: false,
      expires,
    }),
  getToken: () => Cookies.get("token"),
  clearToken: () => Cookies.remove("token"),
};

// ----------------------------
// 8. User Queries
// ----------------------------
export async function getUserMe(): Promise<User> {
  return await api<User>({
    url: "/users/me",
    method: "GET",
  });
}
