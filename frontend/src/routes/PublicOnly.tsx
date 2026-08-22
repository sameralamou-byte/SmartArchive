import { Navigate, Outlet } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function PublicOnly() {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (accessToken) {
    return <Navigate to="/app" replace />;
  }
  return <Outlet />;
}
