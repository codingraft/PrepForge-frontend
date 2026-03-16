export const parseApiError = async (error, fallbackMessage) => {
  const defaultMessage = fallbackMessage || "Something went wrong";

  if (!error) return defaultMessage;

  // Network-level errors (server down, CORS, offline, timeout, etc.)
  if (!error.response) {
    if (error.code === "ECONNABORTED") return "Request timed out. Please try again.";
    return "Network error. Check your internet connection and server status.";
  }

  const { status, data } = error.response;

  if (data instanceof Blob) {
    try {
      const text = await data.text();
      const parsed = JSON.parse(text);
      if (parsed?.message) return parsed.message;
    } catch {
      // ignore blob parse issues and fall through to status-based message
    }
  }

  if (typeof data === "string") {
    try {
      const parsed = JSON.parse(data);
      if (parsed?.message) return parsed.message;
    } catch {
      if (data.trim()) return data;
    }
  }

  if (data?.message) return data.message;

  if (status === 401) return "Unauthorized. Please log in again.";
  if (status === 403) return "Access denied.";
  if (status === 404) return "Requested resource was not found.";
  if (status === 422) return "Validation failed. Please review your input.";
  if (status >= 500) return "Server error. Please try again later.";

  return defaultMessage;
};
