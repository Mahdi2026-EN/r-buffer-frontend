import type { Locale } from "../i18n/types";

export type MultilingualText = Record<Locale, string>;

export type AccountStatus = "pending" | "approved" | "denied" | "suspended";
export type OrderStatus = "pending" | "approved" | "processing" | "completed" | "rejected" | "cancelled";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type PaymentMethod = "cash" | "card" | "bank" | "other";

export interface Category {
  id: string;
  name: MultilingualText;
  description?: MultilingualText;
  icon?: string;
  image?: string;
  order: number;
  active: boolean;
}

export interface Product {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  categoryId: string;
  price: number;
  image?: string;
  available: boolean;
  stock: number;
  createdAt: string;
  featured: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  status: AccountStatus;
  role: "user" | "admin";
  credit: number;
  createdAt: string;
  lastLogin?: string;
}

export interface CreditTransaction {
  id: string;
  userId: string;
  type: "added" | "used";
  amount: number;
  description: string;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  note?: string;
  status: PaymentStatus;
  adminNote?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface OrderItem {
  productId: string;
  productName: MultilingualText;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  adminNote?: string;
  createdAt: string;
  timeline: { status: OrderStatus; date: string }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: "account" | "payment" | "order" | "announcement" | "credit";
  title: MultilingualText;
  body: MultilingualText;
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: MultilingualText;
  body: MultilingualText;
  published: boolean;
  createdAt: string;
  language: Locale | "all";
}

export interface CmsContent {
  id: string;
  page: string;
  section: string;
  key: string;
  value: MultilingualText;
}

export interface SiteSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
  defaultLanguage: Locale;
  supportedLanguages: Locale[];
  theme: "light" | "dark" | "auto";
  enableNotifications: boolean;
}