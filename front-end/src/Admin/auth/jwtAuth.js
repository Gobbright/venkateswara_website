const TOKEN_KEY = "svfs_admin_jwt";

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

const createMockJwt = (payload) => {
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));

  return `${encodedHeader}.${encodedPayload}.mock-signature`;
};

const readMockJwt = (token) => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

export const loginAdmin = ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const adminUser = ADMIN_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password
  );

  if (!adminUser) {
    return { ok: false, token: "" };
  }

  const token = createMockJwt({
    email: adminUser.email,
    name: adminUser.name,
    role: adminUser.role,
    label: adminUser.label,
    permissions: adminUser.permissions,
    startPath: adminUser.startPath,
    issuedAt: Date.now(),
  });

  localStorage.setItem(TOKEN_KEY, token);

  return { ok: true, token };
};

export const getAdminSession = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return null;
  }

  const payload = readMockJwt(token);

  const knownUser = ADMIN_USERS.some((user) => user.role === payload?.role);

  if (!knownUser || !Array.isArray(payload?.permissions)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }

  return { token, user: payload };
};

export const logoutAdmin = () => {
  localStorage.removeItem(TOKEN_KEY);
};
