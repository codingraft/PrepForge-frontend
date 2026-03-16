import { useContext, useState } from "react";
import { toast } from "sonner";
import { AuthContext } from "../auth.context.js";
import { login, signup, logout, getCurrentUser } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  const { user, setUser, loading, setLoading } = context;
  const [error, setError] = useState(null);

  const handleLogin = async ({ identifier, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await login(identifier, password);
      setUser(data.user);
      toast.success("Logged in successfully");
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async ({ username, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await signup(username, email, password);
      setUser(data.user);
      toast.success("Account created successfully");
      return true;
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      toast.success("Logged out");
    } catch (err) {
      setError(err.message);
      toast.error(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUser();
      setUser(data?.user ?? null);
    } catch (err) {
      setError(err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    loading,
    setLoading,
    error,
    setError,
    handleLogin,
    handleSignup,
    handleLogout,
    fetchCurrentUser,
  };
};
