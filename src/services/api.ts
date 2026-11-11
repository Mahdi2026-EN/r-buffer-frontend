
// Real API layer: every call goes to the Spring Boot backend.
// Response shapes match the backend DTOs (status/method/type values are lower case).

import type {
  Announcement,
  Category,
  CmsContent,
  CreditTransaction,
  Notification,
  Order,
  PaymentMethod,
  PaymentRequest,
  Product,
  SiteSettings,
  User,
  AccountStatus,
} from "../types";

import { ApiError, apiRequest } from "./http";
import { authService as session, mapBackendUser, type BackendUser } from "./auth";

export interface AdminStats {
  totalUsers: number;
  pendingUsers: number;
  approvedUsers: number;
  totalCredit: number;
  pendingPayments: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  productsCount: number;
  daily: {
    date: string;
    orders: number;
    added: number;
    used: number;
    registered: number;
  }[];
  productActivity: { name: string; value: number }[];
}

// Calls that need a signed-in user.
// An expired or invalid token signs the user out.
async function authed<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = session.getToken();

  if (!token) {
    throw new ApiError(
      "Please sign in to continue.",
      "UNAUTHENTICATED",
      401,
    );
  }

  try {
    return await apiRequest<T>(path, init, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      session.logout();
      window.location.href = "/login";
    }

    throw error;
  }
}

const json = (body: unknown): RequestInit => ({
  method: "POST",
  body: JSON.stringify(body),
});

const patch = (body?: unknown): RequestInit => ({
  method: "PATCH",
  body: body === undefined ? undefined : JSON.stringify(body),
});

const put = (body: unknown): RequestInit => ({
  method: "PUT",
  body: JSON.stringify(body),
});

// =================== Products ===================
export const productService = {
  // Public: available products for the shop
  async list(): Promise<Product[]> {
    return apiRequest<Product[]>("/products");
  },

  // Admin: every product, including unavailable ones
  async listAll(): Promise<Product[]> {
    return authed<Product[]>("/products/admin");
  },

  async getById(id: string): Promise<Product> {
    return apiRequest<Product>(
      `/products/${encodeURIComponent(id)}`,
    );
  },

  async create(
    data: Omit<Product, "id" | "createdAt">,
  ): Promise<Product> {
    return authed<Product>(
      "/products",
      json(toProductPayload(data)),
    );
  },

  async update(
    id: string,
    data: Partial<Product>,
  ): Promise<Product> {
    return authed<Product>(
      `/products/${encodeURIComponent(id)}`,
      put(toProductPayload(data)),
    );
  },

  async delete(id: string): Promise<void> {
    await authed<void>(
      `/products/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },

  // Admin: upload or replace a product image
  async uploadImage(id: string, file: File): Promise<Product> {
    const formData = new FormData();
    formData.append("file", file);

    return authed<Product>(
      `/admin/products/${encodeURIComponent(id)}/image`,
      {
        method: "POST",
        body: formData,
      },
    );
  },
};

function toProductPayload(data: Partial<Product>) {
  return {
    name: data.name,
    description: data.description,
    categoryId:
      data.categoryId !== undefined
        ? Number(data.categoryId)
        : undefined,
    price: data.price,
    image: data.image || null,
    available: data.available,
    stock: data.stock,
    featured: data.featured,
  };
}

// =================== Categories ===================
export const categoryService = {
  // Admin: all categories including inactive ones
  async list(): Promise<Category[]> {
    return authed<Category[]>("/admin/categories");
  },

  // Public: active categories
  async listPublic(): Promise<Category[]> {
    return apiRequest<Category[]>("/categories");
  },

  async create(data: Omit<Category, "id">): Promise<Category> {
    return authed<Category>("/admin/categories", json(data));
  },

  async update(
    id: string,
    data: Partial<Category>,
  ): Promise<Category> {
    return authed<Category>(
      `/admin/categories/${encodeURIComponent(id)}`,
      put(data),
    );
  },

  // Deactivates the category instead of deleting it
  async delete(id: string): Promise<void> {
    await authed<void>(
      `/admin/categories/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },
};

// =================== Users (admin) ===================
export const userService = {
  async list(): Promise<User[]> {
    const rows = await authed<BackendUser[]>("/admin/users");
    return rows.map(mapBackendUser);
  },

  // Maps the panel's status choice onto the backend actions
  async updateStatus(
    user: User,
    status: AccountStatus,
  ): Promise<void> {
    let action: string;

    if (status === "approved") {
      action = user.status === "pending" ? "approve" : "activate";
    } else if (status === "suspended") {
      action = "suspend";
    } else if (status === "denied") {
      action = "reject";
    } else {
      throw new ApiError(
        "This status change is not supported.",
        "INVALID_STATUS_CHANGE",
        400,
      );
    }

    await authed<BackendUser>(
      `/admin/users/${encodeURIComponent(user.id)}/${action}`,
      patch(),
    );
  },
};

// =================== Orders ===================
export const orderService = {
  // Customer: my orders
  async listMine(): Promise<Order[]> {
    return authed<Order[]>("/orders/mine");
  },

  async getMine(id: string): Promise<Order> {
    return authed<Order>(
      `/orders/mine/${encodeURIComponent(id)}`,
    );
  },

  // Customer: place an order; server checks credit and stock
  async create(
    items: { productId: string; quantity: number }[],
  ): Promise<Order> {
    return authed<Order>(
      "/orders",
      json({
        items: items.map((i) => ({
          productId: Number(i.productId),
          quantity: i.quantity,
        })),
      }),
    );
  },

  // Admin: every order
  async list(): Promise<Order[]> {
    return authed<Order[]>("/admin/orders");
  },

  async getAny(id: string): Promise<Order> {
    return authed<Order>(
      `/admin/orders/${encodeURIComponent(id)}`,
    );
  },

  async updateStatus(
    id: string,
    status: Order["status"],
    note?: string,
  ): Promise<Order> {
    return authed<Order>(
      `/admin/orders/${encodeURIComponent(id)}/status`,
      patch({ status, note }),
    );
  },
};

// =================== Payment requests ===================
export const paymentRequestService = {
  async listMine(): Promise<PaymentRequest[]> {
    return authed<PaymentRequest[]>("/payment-requests/mine");
  },

  async list(): Promise<PaymentRequest[]> {
    return authed<PaymentRequest[]>("/admin/payment-requests");
  },

  async create(data: {
    amount: number;
    method: PaymentMethod;
    reference: string;
    note?: string;
  }): Promise<PaymentRequest> {
    return authed<PaymentRequest>(
      "/payment-requests",
      json(data),
    );
  },

  async approve(id: string): Promise<PaymentRequest> {
    return authed<PaymentRequest>(
      `/admin/payment-requests/${encodeURIComponent(id)}/approve`,
      patch(),
    );
  },

  async reject(
    id: string,
    note?: string,
  ): Promise<PaymentRequest> {
    return authed<PaymentRequest>(
      `/admin/payment-requests/${encodeURIComponent(id)}/reject`,
      patch({ note }),
    );
  },
};

// =================== Credit ===================
export const creditService = {
  async listMine(): Promise<CreditTransaction[]> {
    return authed<CreditTransaction[]>("/credit/mine");
  },

  async listAll(): Promise<CreditTransaction[]> {
    return authed<CreditTransaction[]>("/admin/credit/transactions");
  },

  async adjust(
    userId: string,
    type: "add" | "remove",
    amount: number,
    note: string,
  ): Promise<void> {
    await authed<void>(
      `/admin/users/${encodeURIComponent(userId)}/credit`,
      json({ type, amount, note }),
    );
  },
};

// =================== Notifications ===================
export const notificationService = {
  async listMine(): Promise<Notification[]> {
    return authed<Notification[]>("/notifications/mine");
  },

  async markRead(id: string): Promise<void> {
    await authed<void>(
      `/notifications/${encodeURIComponent(id)}/read`,
      patch(),
    );
  },

  async markAllRead(): Promise<void> {
    await authed<void>("/notifications/read-all", patch());
  },
};

// =================== Content / announcements ===================
export const contentService = {
  // Public: editable website text
  async listContent(): Promise<CmsContent[]> {
    return apiRequest<CmsContent[]>("/content");
  },

  async updateContent(
    id: string,
    value: CmsContent["value"],
  ): Promise<CmsContent> {
    return authed<CmsContent>(
      `/admin/content/${encodeURIComponent(id)}`,
      put({ value }),
    );
  },

  // Public: published announcements
  async getAnnouncements(): Promise<Announcement[]> {
    return apiRequest<Announcement[]>("/announcements");
  },

  // Admin: every announcement including drafts
  async listAnnouncements(): Promise<Announcement[]> {
    return authed<Announcement[]>("/admin/announcements");
  },

  async createAnnouncement(
    data: Omit<Announcement, "id" | "createdAt">,
  ): Promise<Announcement> {
    return authed<Announcement>(
      "/admin/announcements",
      json(data),
    );
  },

  async updateAnnouncement(
    id: string,
    data: Partial<Announcement>,
  ): Promise<Announcement> {
    return authed<Announcement>(
      `/admin/announcements/${encodeURIComponent(id)}`,
      put(data),
    );
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await authed<void>(
      `/admin/announcements/${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
  },
};

// =================== Settings ===================
export const settingsService = {
  // Public: the same settings the site header and footer use
  async get(): Promise<SiteSettings> {
    return apiRequest<SiteSettings>("/settings");
  },

  async update(data: SiteSettings): Promise<SiteSettings> {
    return authed<SiteSettings>("/admin/settings", put(data));
  },
};

// =================== Admin statistics ===================
export const statsService = {
  async get(): Promise<AdminStats> {
    return authed<AdminStats>("/admin/stats");
  },
};
