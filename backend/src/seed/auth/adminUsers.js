import { demoAdminUsers } from "../../data/auth/demoAdminUsers.js";
import AdminUser from "../../models/auth/AdminUser.js";
import { hashPassword } from "../../utils/auth/password.js";

export const seedAdminUsers = async () => {
  await Promise.all(
    demoAdminUsers.map(async (adminUser) => {
      const existingUser = await AdminUser.findOne({ email: adminUser.email });

      if (existingUser) {
        return;
      }

      await AdminUser.create({
        ...adminUser,
        password: hashPassword(adminUser.password),
      });
    })
  );
};
