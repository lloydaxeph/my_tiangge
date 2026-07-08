import { useEffect, type ReactNode } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from "../common/Spinner";
import { ROUTES } from "../../lib/routes";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && profile?.is_disabled) {
      signOut().then(() => navigate(`${ROUTES.login}?disabled=1`, { replace: true }));
    }
  }, [loading, profile, signOut, navigate]);

  if (loading) return <Spinner />;
  if (!session) return <Navigate to={ROUTES.login} replace />;
  if (profile?.is_disabled) return <Spinner />;

  return <>{children}</>;
}
