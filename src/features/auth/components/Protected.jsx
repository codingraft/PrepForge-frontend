import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";
import PageLoader from "../../../components/PageLoader";

export const Protected = () => {
  const { loading, user } = useAuth();

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};
