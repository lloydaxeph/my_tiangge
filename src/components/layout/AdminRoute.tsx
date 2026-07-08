import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../common/Spinner";
import { ROUTES } from "../../lib/routes";
import { ProtectedRoute } from "./ProtectedRoute";

export function AdminRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();

  return (
    <ProtectedRoute>
      {loading ? (
        <Spinner />
      ) : profile?.is_admin ? (
        <>{children}</>
      ) : (
        <Navigate to={ROUTES.home} replace />
      )}
    </ProtectedRoute>
  );
}
