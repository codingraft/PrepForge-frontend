import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../../../components/PageLoader";

export const GuestOnly = () => {
  const { loading, user } = useAuth();

  if (loading) return <PageLoader />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
};
