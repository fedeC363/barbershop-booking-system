import type { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";

function AdminRoute({ children }: PropsWithChildren) {
  const { isLoading, role, user } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (role !== "ADMIN") {
    return <Navigate replace to="/my-appointments" />;
  }

  return children;
}

export default AdminRoute;
