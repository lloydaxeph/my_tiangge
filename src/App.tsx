import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AdminRoute } from "./components/layout/AdminRoute";
import { ROUTES } from "./lib/routes";

import { LoginPage } from "./pages/auth/LoginPage";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { ForgotPasswordPage } from "./pages/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./pages/auth/ResetPasswordPage";

import { HomePage } from "./pages/HomePage";

import { POSPage } from "./pages/pos/POSPage";
import { SaleReceiptPage } from "./pages/pos/SaleReceiptPage";

import { InventoryListPage } from "./pages/inventory/InventoryListPage";
import { ProductAddPage } from "./pages/inventory/ProductAddPage";
import { ProductEditPage } from "./pages/inventory/ProductEditPage";

import { CustomerListPage } from "./pages/customers/CustomerListPage";
import { CustomerDetailPage } from "./pages/customers/CustomerDetailPage";
import { ReminderListPage } from "./pages/customers/ReminderListPage";

import { SettingsPage } from "./pages/settings/SettingsPage";
import { EditProfilePage } from "./pages/settings/EditProfilePage";
import { GcashQrPage } from "./pages/settings/GcashQrPage";

import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { AdminInventoryPage } from "./pages/admin/AdminInventoryPage";
import { AdminUtangPage } from "./pages/admin/AdminUtangPage";
import { AdminSalesPage } from "./pages/admin/AdminSalesPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to={ROUTES.home} replace />} />

          <Route path={ROUTES.login} element={<LoginPage />} />
          <Route path={ROUTES.signup} element={<SignUpPage />} />
          <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.resetPassword} element={<ResetPasswordPage />} />

          <Route
            path={ROUTES.home}
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.pos}
            element={
              <ProtectedRoute>
                <POSPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pos/receipt/:saleId"
            element={
              <ProtectedRoute>
                <SaleReceiptPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.inventory}
            element={
              <ProtectedRoute>
                <InventoryListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.inventoryNew}
            element={
              <ProtectedRoute>
                <ProductAddPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory/:id/edit"
            element={
              <ProtectedRoute>
                <ProductEditPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.customers}
            element={
              <ProtectedRoute>
                <CustomerListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.customerReminders}
            element={
              <ProtectedRoute>
                <ReminderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers/:id"
            element={
              <ProtectedRoute>
                <CustomerDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.settings}
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.settingsProfile}
            element={
              <ProtectedRoute>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.settingsGcashQr}
            element={
              <ProtectedRoute>
                <GcashQrPage />
              </ProtectedRoute>
            }
          />

          <Route
            path={ROUTES.adminUsers}
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminInventory}
            element={
              <AdminRoute>
                <AdminInventoryPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminUtang}
            element={
              <AdminRoute>
                <AdminUtangPage />
              </AdminRoute>
            }
          />
          <Route
            path={ROUTES.adminSales}
            element={
              <AdminRoute>
                <AdminSalesPage />
              </AdminRoute>
            }
          />

          <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
