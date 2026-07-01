/**
 * SmartNest API Client
 * All calls go through this module. When VITE_API_URL is set, it calls
 * the Express backend. Otherwise falls back to static data.
 */
const BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

async function request(path, opts = {}) {
  const { method = "GET", body, token } = opts;
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let targetUrl = `${BASE_URL}${path}`;
  if (BASE_URL.endsWith("/api") && path.startsWith("/api/")) {
    targetUrl = `${BASE_URL.slice(0, -4)}${path}`;
  }

  const res = await fetch(targetUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Request failed");
  return json;
}

async function upload(path, formData, token, method = "POST") {
  let targetUrl = `${BASE_URL}${path}`;
  if (BASE_URL.endsWith("/api") && path.startsWith("/api/")) {
    targetUrl = `${BASE_URL.slice(0, -4)}${path}`;
  }

  const res = await fetch(targetUrl, {
    method,
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Upload failed");
  return json;
}

// ─── Auth ───────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),
  me: (token) => request("/api/auth/me", { token }),
};

// ─── User Auth ───────────────────────────────────────────────────────────────
export const userAuthApi = {
  register: (name, email, password) =>
    request("/api/user/register", {
      method: "POST",
      body: { name, email, password },
    }),
  login: (email, password) =>
    request("/api/user/login", {
      method: "POST",
      body: { email, password },
    }),
  me: (token) => request("/api/user/me", { token }),
  googleAuth: (name, email) =>
    request("/api/user/google-auth", {
      method: "POST",
      body: { name, email },
    }),
  forgotPassword: (email) =>
    request("/api/user/forgot-password", {
      method: "POST",
      body: { email },
    }),
  resetPassword: (email, otp, newPassword) =>
    request("/api/user/reset-password", {
      method: "POST",
      body: { email, otp, newPassword },
    }),
};

// ─── Products ────────────────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getBySlug: (slug) => request(`/api/products/${slug}`),
  create: (formData, token) => upload("/api/products", formData, token, "POST"),
  update: (id, formData, token) =>
    upload(`/api/products/${id}`, formData, token, "PUT"),
  delete: (id, token) =>
    request(`/api/products/${id}`, { method: "DELETE", token }),
  deleteImage: (id, imageUrl, token) =>
    request(`/api/products/${id}/images`, { method: "DELETE", body: { imageUrl }, token }),
};

// ─── Categories ──────────────────────────────────────────────────────────────
export const categoriesApi = {
  getAll: async () => {
    const data = await request("/api/categories");
    return Array.isArray(data) ? { categories: data } : data;
  },
  create: (formData, token) => upload("/api/categories", formData, token, "POST"),
  update: (id, formData, token) =>
    upload(`/api/categories/${id}`, formData, token, "PUT"),
  delete: (id, token) =>
    request(`/api/categories/${id}`, { method: "DELETE", token }),
};

// ─── Brands ──────────────────────────────────────────────────────────────────
export const brandsApi = {
  getAll: async () => {
    const data = await request("/api/brands");
    return Array.isArray(data) ? { brands: data } : data;
  },
  create: (formData, token) => upload("/api/brands", formData, token, "POST"),
  update: (id, formData, token) =>
    upload(`/api/brands/${id}`, formData, token, "PUT"),
  delete: (id, token) =>
    request(`/api/brands/${id}`, { method: "DELETE", token }),
};

// ─── Enquiries ───────────────────────────────────────────────────────────────
export const enquiriesApi = {
  create: (data) => request("/api/enquiries", { method: "POST", body: data }),
  getAll: async (token, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    const data = await request(`/api/enquiries${qs ? `?${qs}` : ""}`, { token });
    return Array.isArray(data) ? { enquiries: data } : data;
  },
  updateStatus: (id, status, token) =>
    request(`/api/enquiries/${id}`, { method: "PUT", body: { status }, token }),
  delete: (id, token) =>
    request(`/api/enquiries/${id}`, { method: "DELETE", token }),
};

// ─── Schedules ───────────────────────────────────────────────────────────────
export const schedulesApi = {
  getAvailable: (date) => request(`/api/schedules/available?date=${encodeURIComponent(date)}`),
  getAll: (token) => request("/api/schedules", { token }),
  create: (data, token) => request("/api/schedules", { method: "POST", body: data, token }),
  update: (id, data, token) => request(`/api/schedules/${id}`, { method: "PUT", body: data, token }),
  delete: (id, token) => request(`/api/schedules/${id}`, { method: "DELETE", token }),
};

// ─── Appointments ────────────────────────────────────────────────────────────
export const appointmentsApi = {
  create: (data) => request("/api/appointments", { method: "POST", body: data }),
  getAll: (token) => request("/api/appointments", { token }),
  updateStatus: (id, status, token) =>
    request(`/api/appointments/${id}/status`, { method: "PUT", body: { status }, token }),
  delete: (id, token) => request(`/api/appointments/${id}`, { method: "DELETE", token }),
};
