import axios from "axios";

const api = axios.create({
  baseURL: "https://balanceiq-backend.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds — if backend doesn't respond, we know
});

// Automatically attach JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — classify every error ──
api.interceptors.response.use(
  response => response,
  error => {
    const err = classifyError(error);
    return Promise.reject(err);
  }
);

// ── Error classifier ──
export function classifyError(error) {
  // No response at all — network or backend is down
  if (!error.response) {
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return {
        type:    "backend",
        code:    "TIMEOUT",
        message: "The server took too long to respond. Please try again.",
        raw:     error,
      };
    }
    return {
      type:    "backend",
      code:    "OFFLINE",
      message: "Cannot reach the server. Check your internet connection or try again later.",
      raw:     error,
    };
  }

  const status = error.response.status;
  const data   = error.response.data;

  // Extract backend message if available
  const backendMsg = data?.detail || data?.message || data?.error || null;

  // 400 — bad input, this is a frontend/user error
  if (status === 400) {
    return {
      type:    "frontend",
      code:    "BAD_REQUEST",
      message: backendMsg || "Some of the information you entered is invalid. Please check and try again.",
      raw:     error,
    };
  }

  // 401 — not authenticated
  if (status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return {
      type:    "frontend",
      code:    "UNAUTHORIZED",
      message: backendMsg || "Your session has expired. Please log in again.",
      raw:     error,
    };
  }

  // 403 — forbidden
  if (status === 403) {
    return {
      type:    "frontend",
      code:    "FORBIDDEN",
      message: backendMsg || "You don't have permission to do that.",
      raw:     error,
    };
  }

  // 404 — not found
  if (status === 404) {
    return {
      type:    "backend",
      code:    "NOT_FOUND",
      message: backendMsg || "The requested resource was not found on the server.",
      raw:     error,
    };
  }

  // 409 — conflict (e.g. email already registered)
  if (status === 409) {
    return {
      type:    "frontend",
      code:    "CONFLICT",
      message: backendMsg || "This already exists. Please check your information.",
      raw:     error,
    };
  }

  // 422 — validation error (FastAPI sends these for invalid request bodies)
  if (status === 422) {
    const detail = data?.detail;
    let msg = "Some fields are invalid. Please check your information.";
    if (Array.isArray(detail) && detail.length > 0) {
      // FastAPI returns array of validation errors — extract first readable one
      const first = detail[0];
      const field = first?.loc?.[first.loc.length - 1] ?? "field";
      msg = `Invalid value for "${field}": ${first?.msg ?? "please check this field."}`;
    }
    return {
      type:    "frontend",
      code:    "VALIDATION",
      message: msg,
      raw:     error,
    };
  }

  // 429 — rate limited
  if (status === 429) {
    return {
      type:    "backend",
      code:    "RATE_LIMITED",
      message: "Too many requests. Please slow down and try again in a moment.",
      raw:     error,
    };
  }

  // 500+ — server error, backend problem
  if (status >= 500) {
    return {
      type:    "backend",
      code:    "SERVER_ERROR",
      message: "Something went wrong on the server. This is not your fault — please try again later.",
      raw:     error,
    };
  }

  // Unknown
  return {
    type:    "unknown",
    code:    "UNKNOWN",
    message: backendMsg || "An unexpected error occurred. Please try again.",
    raw:     error,
  };
}

export default api;