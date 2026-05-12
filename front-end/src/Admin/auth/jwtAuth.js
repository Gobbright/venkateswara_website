const TOKEN_KEY = "svfs_admin_jwt";
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const ADMIN_USERS = [
  {
    email: "admin1@gmail.com",
    password: "Admin@1",
    name: "Admin 1",
    role: "main-admin",
    label: "All access",
    permissions: ["dashboard", "orders", "category", "products", "product-add", "users", "video-calls", "enquiries"],
    startPath: "/admin/dashboard",
  },
  {
    email: "admin2@gmail.com",
    password: "Admin@2",
    name: "Admin 2",
    role: "orders-manager",
    label: "Orders and products",
    permissions: ["orders", "products", "product-add"],
    startPath: "/admin/orders",
  },
  {
    email: "admin3@gmail.com",
    password: "Admin@3",
    name: "Admin 3",
    role: "support-viewer",
    label: "Enquiries view",
    permissions: ["enquiries"],
    startPath: "/admin/enquiries",
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

export const updateAdminProfile = (profile) => {
  const session = getAdminSession();

  if (!session) {
    return null;
  }

  const nextUser = {
    ...session.user,
    name: profile.name.trim(),
    email: profile.email.trim().toLowerCase(),
    label: profile.label.trim(),
  };
  const token = createMockJwt({
    ...nextUser,
    updatedAt: Date.now(),
  });

  localStorage.setItem(TOKEN_KEY, token);

  return { token, user: nextUser };
};

export const logoutAdmin = () => {
  localStorage.removeItem(TOKEN_KEY);
};
