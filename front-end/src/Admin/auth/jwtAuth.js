const TOKEN_KEY = "svfs_admin_jwt";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ADMIN_USERS = [
  {
    email: "admin@gobrightglobal.com",
    password: "admin123",
    name: "Main Admin",
    role: "main-admin",
    label: "All access",
    permissions: ["dashboard", "orders", "category", "products", "product-add", "users", "video-calls", "enquiries"],
    startPath: "/admin/dashboard",
  },
  {
    email: "orders@gobrightglobal.com",
    password: "orders123",
    name: "Orders Manager",
    role: "orders-manager",
    label: "Orders, category, product list, product add",
    permissions: ["orders", "category", "products", "product-add"],
    startPath: "/admin/orders",
  },
  {
    email: "support@gobrightglobal.com",
    password: "support123",
    name: "Support Viewer",
    role: "support-viewer",
    label: "Users, video calls, enquiries view",
    permissions: ["users", "video-calls", "enquiries"],
    startPath: "/admin/users",
  },
];

export const hasAdminAccess = (user, permission) =>
  Boolean(user?.permissions?.includes(permission));

export const getAdminStartPath = (user) => user?.startPath || "/admin";

const readJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    return JSON.parse(atob(paddedBase64));
  } catch {
    return null;
  }
};

export const fetchDemoAdmins = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/demo-admins`);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Demo admin users load panna mudiyala");
  }

  return result.data;
};

export const loginAdmin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();

  if (!response.ok) {
    return { ok: false, token: "", message: result.message };
  }

  const token = result.token;

  localStorage.setItem(TOKEN_KEY, token);

  return { ok: true, token, user: result.user };
};

export const getAdminSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  const payload = readJwt(token);

  const knownUser = payload?.role && payload.role !== "customer";

  if (!knownUser || !Array.isArray(payload?.permissions)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return { token, user: payload };
};

export const logoutAdmin = () => {
  localStorage.removeItem(TOKEN_KEY);
};
