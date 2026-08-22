import { Navigate } from "react-router-dom";

import { useAuthStore } from "../store/authStore";

export default function HomeRedirect() {
  const accessToken = useAuthStore((state) => state.accessToken);
  return <Navigate to={accessToken ? "/app" : "/login"} replace />;
}
