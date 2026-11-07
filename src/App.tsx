import { BrowserRouter, Route, Routes } from "react-router-dom";
import { I18nProvider } from "./i18n/I18nProvider";
import { ToastProvider } from "./components/ui/Toast";
import { PublicLayout } from "./components/layout/PublicLayout";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AdminLayout } from "./components/layout/AdminLayout";
import { HomePage } from "./pages/public/HomePage";
import { ProductsPage } from "./pages/public/ProductsPage";
import { ProductDetailsPage } from "./pages/public/ProductDetailsPage";
import { AboutPage } from "./pages/public/AboutPage";
import { ContactPage } from "./pages/public/ContactPage";
import { FaqPage } from "./pages/public/FaqPage";
import { AnnouncementsPage } from "./pages/public/AnnouncementsPage";
import { HowItWorksPage } from "./pages/public/HowItWorksPage";
import { NotFoundPage } from "./pages/public/NotFoundPage";
import { UnauthorizedPage } from "./pages/public/UnauthorizedPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/user/DashboardPage";
import { CreditPage } from "./pages/user/CreditPage";
import { PaymentRequestsPage } from "./pages/user/PaymentRequestsPage";
import { OrdersPage } from "./pages/user/OrdersPage";
import { OrderDetailsPage } from "./pages/user/OrderDetailsPage";
import { NotificationsPage } from "./pages/user/NotificationsPage";
import { ProfilePage } from "./pages/user/ProfilePage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UsersPage } from "./pages/admin/UsersPage";
import { RegistrationsPage } from "./pages/admin/RegistrationsPage";
import { AdminPaymentRequestsPage } from "./pages/admin/AdminPaymentRequestsPage";
import { AdminCreditPage } from "./pages/admin/AdminCreditPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminCategoriesPage } from "./pages/admin/AdminCategoriesPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminOrderDetailsPage } from "./pages/admin/AdminOrderDetailsPage";
import { AdminContentPage } from "./pages/admin/AdminContentPage";
import { AdminAnnouncementsPage } from "./pages/admin/AdminAnnouncementsPage";
import { AdminReportsPage } from "./pages/admin/AdminReportsPage";
import { AdminSettingsPage } from "./pages/admin/AdminSettingsPage";
import { RequireAuth } from "./components/layout/RequireAuth";

export default function App() {
  return (
    <I18nProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="products/:id" element={<ProductDetailsPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="faq" element={<FaqPage />} />
              <Route path="announcements" element={<AnnouncementsPage />} />
              <Route path="unauthorized" element={<UnauthorizedPage />} />
            </Route>

            {/* Auth routes (no main layout) */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* Customer routes (sign-in required) */}
            <Route element={<RequireAuth role="user" />}>
              <Route element={<DashboardLayout />}>
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="credit" element={<CreditPage />} />
                <Route path="payment-requests" element={<PaymentRequestsPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="orders/:id" element={<OrderDetailsPage />} />
                <Route path="notifications" element={<NotificationsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>
            </Route>

            {/* Admin routes */}
            <Route element={<RequireAuth role="admin" />}>
            <Route path="admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboardPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="registrations" element={<RegistrationsPage />} />
              <Route path="payment-requests" element={<AdminPaymentRequestsPage />} />
              <Route path="credit" element={<AdminCreditPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="orders" element={<AdminOrdersPage />} />
              <Route path="orders/:id" element={<AdminOrderDetailsPage />} />
              <Route path="content" element={<AdminContentPage />} />
              <Route path="announcements" element={<AdminAnnouncementsPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="settings" element={<AdminSettingsPage />} />
            </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </I18nProvider>
  );
}