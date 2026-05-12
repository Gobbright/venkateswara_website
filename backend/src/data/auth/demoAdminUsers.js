export const demoAdminUsers = [
  {
    email: "admin1@gmail.com",
    password: "Admin@1",
    name: "Admin 1",
    role: "main_admin",
    access: "All Access",
    jwtAuth: true,
    status: 1,
  },
  {
    email: "admin2@gmail.com",
    password: "Admin@2",
    name: "Admin 2",
    role: "orders_manager",
    access: ["orders", "product_list", "product_add"],
    jwtAuth: true,
    status: 1,
  },
  {
    email: "admin3@gmail.com",
    password: "Admin@3",
    name: "Admin 3",
    role: "support_viewer",
    access: ["enquiries_view"],
    jwtAuth: true,
    status: 1,
  },
];
