export const demoAdminUsers = [
  {
    email: "admin@gobrightglobal.com",
    password: "admin123",
    name: "Main Admin",
    role: "main_admin",
    access: "All Access",
    jwtAuth: true,
    status: 1,
  },
  {
    email: "orders@gobrightglobal.com",
    password: "orders123",
    name: "Orders Manager",
    role: "orders_manager",
    access: ["orders", "category", "product_list", "product_add"],
    jwtAuth: true,
    status: 1,
  },
  {
    email: "support@gobrightglobal.com",
    password: "support123",
    name: "Support Viewer",
    role: "support_viewer",
    access: ["users", "video_calls", "enquiries_view"],
    jwtAuth: true,
    status: 1,
  },
];
