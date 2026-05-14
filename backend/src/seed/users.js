import User from "../models/auth/User.js";

export const normalizeUsers = async () => {
  const codedUsers = await User.find({ userCode: /^USR-/ }).select("userCode");
  let lastNumber = codedUsers.reduce((max, user) => {
    const value = Number(user.userCode?.replace(/\D/g, "") || 0);
    return Number.isFinite(value) ? Math.max(max, value) : max;
  }, 0);

  const users = await User.find({
    $or: [{ userCode: { $exists: false } }, { userCode: "" }, { userCode: null }],
  }).sort({ createdAt: 1 });

  for (const user of users) {
    lastNumber += 1;
    user.userCode = `USR-${String(lastNumber).padStart(3, "0")}`;
    await user.save();
  }
};
