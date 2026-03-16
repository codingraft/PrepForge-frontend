import axios from "axios";
import { parseApiError } from "../../../utils/api-error";

const API_URL = `${import.meta.env.VITE_API_URL}/api/auth`;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const signup = async (username, email, password) => {
  try {
    const res = await api.post(`/register`, {
      username,
      email,
      password,
    });
    return res.data;
  } catch (err) {
    throw new Error(await parseApiError(err, "Signup failed"));
  }
};

export const login = async (identifier, password) => {
  try {
    const res = await api.post(`/login`, {
      password,
      ...(identifier.includes("@")
        ? { email: identifier }
        : { username: identifier }),
    });
    return res.data;
  } catch (err) {
    throw new Error(await parseApiError(err, "Login failed"));
  }
};

export const logout = async () => {
  try {
    await api.post(`/logout`, {});
  } catch (err) {
    throw new Error(await parseApiError(err, "Logout failed"));
  }
};

export const getCurrentUser = async () => {
  try {
    const res = await api.get(`/me`);
    return res.data;
  } catch (err) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      return null;
    }
    throw new Error(await parseApiError(err, "Failed to fetch current user"));
  }
};
