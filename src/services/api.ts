
// API service layer — designed to mirror Spring Boot REST endpoints.
// Categories are now connected to the real Spring Boot backend.
// Other services remain mock implementations for now.

import type {
  Announcement,
  Category,
  CmsContent,
  Order,
  PaymentMethod,
  PaymentRequest,
  Product,
  SiteSettings,
  User,
} from "../types";

import { apiRequest } from "./http";

import {
  mockAnnouncements,
  mockCategories,
  mockCmsContent,
  mockCreditTransactions,
  mockNotifications,
  mockOrders,
  mockPaymentRequests,
  mockProducts,
  mockUsers,
} from "./mockData";

// Simulate latency for mock services
const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

// =================== Auth ===================
export const authService = {
  async login(_email: string, _password: string) {
    await delay();
    // Mock - returns a sample user
    return { user: mockUsers[0], token: "mock-jwt-token" };
  },

  async register(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    await delay();

    const newUser: User = {
      id: `u-${Date.now()}`,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      status: "pending",
      role: "user",
      credit: 0,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    return newUser;
  },

  async me() {
    return mockUsers[0];
  },
};

// =================== Products ===================
export const productService = {
  async list() {
    await delay();
    return mockProducts;
  },

  async getById(id: string) {
    await delay(150);
    return mockProducts.find((p) => p.id === id);
  },

  async create(data: Omit<Product, "id" | "createdAt">) {
    await delay();

    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    mockProducts.push(newProduct);
    return newProduct;
  },

  async update(id: string, data: Partial<Product>) {
    await delay();

    const idx = mockProducts.findIndex((p) => p.id === id);

    if (idx === -1) {
      throw new Error("Not found");
    }

    mockProducts[idx] = { ...mockProducts[idx], ...data };
    return mockProducts[idx];
  },

  async delete(id: string) {
    await delay();

    const idx = mockProducts.findIndex((p) => p.id === id);

    if (idx !== -1) {
      mockProducts.splice(idx, 1);
    }
  },
};

// =================== Categories ===================
export const categoryService = {
  // Fetch active categories from the real Spring Boot backend
  async list(): Promise<Category[]> {
    return apiRequest<Category[]>("/categories");
  },

  // Create category - mock implementation for now
  async create(data: Omit<Category, "id">) {
    await delay();

    const c: Category = {
      ...data,
      id: `cat-${Date.now()}`,
    };

    mockCategories.push(c);
    return c;
  },

  // Update category - mock implementation for now
  async update(id: string, data: Partial<Category>) {
    await delay();

    const idx = mockCategories.findIndex((c) => c.id === id);

    if (idx === -1) {
      throw new Error("Not found");
    }

    mockCategories[idx] = {
      ...mockCategories[idx],
      ...data,
    };

    return mockCategories[idx];
  },

  // Delete category - mock implementation for now
  async delete(id: string) {
    await delay();

    const idx = mockCategories.findIndex((c) => c.id === id);

    if (idx !== -1) {
      mockCategories.splice(idx, 1);
    }
  },
};

// =================== Users ===================
export const userService = {
  async list() {
    await delay();
    return mockUsers;
  },

  async getById(id: string) {
    return mockUsers.find((u) => u.id === id);
  },

  async updateStatus(id: string, status: User["status"]) {
    await delay();

    const u = mockUsers.find((u) => u.id === id);

    if (u) {
      u.status = status;
    }

    return u;
  },

  async update(id: string, data: Partial<User>) {
    await delay();

    const u = mockUsers.find((u) => u.id === id);

    if (u) {
      Object.assign(u, data);
    }

    return u;
  },
};

// =================== Orders ===================
export const orderService = {
  async list() {
    await delay();
    return mockOrders;
  },

  async listByUser(userId: string) {
    await delay();
    return mockOrders.filter((o) => o.userId === userId);
  },

  async getById(id: string) {
    return mockOrders.find((o) => o.id === id);
  },

  async create(
    data: Omit<Order, "id" | "createdAt" | "timeline" | "status">
  ) {
    await delay();

    const order: Order = {
      ...data,
      id: `ORD-${1000 + mockOrders.length + 1}`,
      status: "pending",
      createdAt: new Date().toISOString(),
      timeline: [
        {
          status: "pending",
          date: new Date().toISOString(),
        },
      ],
    };

    mockOrders.push(order);
    return order;
  },

  async updateStatus(
    id: string,
    status: Order["status"],
    adminNote?: string
  ) {
    await delay();

    const o = mockOrders.find((o) => o.id === id);

    if (!o) {
      throw new Error("Not found");
    }

    o.status = status;

    if (adminNote) {
      o.adminNote = adminNote;
    }

    o.timeline.push({
      status,
      date: new Date().toISOString(),
    });

    return o;
  },
};

// =================== Payment Requests ===================
export const paymentRequestService = {
  async list() {
    await delay();
    return mockPaymentRequests;
  },

  async listByUser(userId: string) {
    await delay();
    return mockPaymentRequests.filter((p) => p.userId === userId);
  },

  async create(data: {
    amount: number;
    method: PaymentMethod;
    reference: string;
    note?: string;
    userId: string;
  }) {
    await delay();

    const pr: PaymentRequest = {
      id: `pr-${Date.now()}`,
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    mockPaymentRequests.push(pr);
    return pr;
  },

  async approve(id: string) {
    await delay();

    const pr = mockPaymentRequests.find((p) => p.id === id);

    if (!pr) {
      throw new Error("Not found");
    }

    pr.status = "approved";
    pr.reviewedAt = new Date().toISOString();

    // Add to user credit
    const u = mockUsers.find((u) => u.id === pr.userId);

    if (u) {
      u.credit += pr.amount;
    }

    // Log credit transaction
    mockCreditTransactions.push({
      id: `ct-${Date.now()}`,
      userId: pr.userId,
      type: "added",
      amount: pr.amount,
      description: `Top-up via ${pr.method}`,
      createdAt: new Date().toISOString(),
    });

    return pr;
  },

  async reject(id: string, adminNote?: string) {
    await delay();

    const pr = mockPaymentRequests.find((p) => p.id === id);

    if (!pr) {
      throw new Error("Not found");
    }

    pr.status = "rejected";
    pr.reviewedAt = new Date().toISOString();

    if (adminNote) {
      pr.adminNote = adminNote;
    }

    return pr;
  },
};

// =================== Notifications ===================
export const notificationService = {
  async listByUser(userId: string) {
    await delay();
    return mockNotifications.filter((n) => n.userId === userId);
  },

  async markAllRead(userId: string) {
    await delay();

    mockNotifications.forEach((n) => {
      if (n.userId === userId) {
        n.read = true;
      }
    });
  },

  async markRead(id: string) {
    await delay();

    const n = mockNotifications.find((n) => n.id === id);

    if (n) {
      n.read = true;
    }
  },
};

// =================== Credit ===================
export const creditService = {
  async listByUser(userId: string) {
    await delay();
    return mockCreditTransactions.filter((c) => c.userId === userId);
  },
};

// =================== Content / CMS ===================
export const contentService = {
  async listContent() {
    await delay();
    return mockCmsContent;
  },

  async updateContent(id: string, value: CmsContent["value"]) {
    await delay();

    const c = mockCmsContent.find((c) => c.id === id);

    if (c) {
      c.value = value;
    }

    return c;
  },

  async getAnnouncements() {
    await delay();
    return mockAnnouncements.filter((a) => a.published);
  },

  async listAnnouncements() {
    await delay();
    return mockAnnouncements;
  },

  async createAnnouncement(
    data: Omit<Announcement, "id" | "createdAt">
  ) {
    await delay();

    const a: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    mockAnnouncements.unshift(a);
    return a;
  },

  async updateAnnouncement(id: string, data: Partial<Announcement>) {
    await delay();

    const a = mockAnnouncements.find((a) => a.id === id);

    if (a) {
      Object.assign(a, data);
    }

    return a;
  },

  async deleteAnnouncement(id: string) {
    await delay();

    const idx = mockAnnouncements.findIndex((a) => a.id === id);

    if (idx !== -1) {
      mockAnnouncements.splice(idx, 1);
    }
  },
};

// =================== Settings ===================
export const settingsService = {
  async get(): Promise<SiteSettings> {
    await delay(100);

    return {
      siteName: "R-Buffer",
      contactEmail: "support@rbuffer.io",
      contactPhone: "+93 700 000 000",
      defaultLanguage: "en",
      supportedLanguages: ["en", "fa", "ps"],
      theme: "light",
      enableNotifications: true,
    };
  },

  async update(_data: Partial<SiteSettings>) {
    await delay();
    return _data;
  },
};
