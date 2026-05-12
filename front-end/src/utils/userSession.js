export const USER_TOKEN_KEY = "svfs_user_jwt";
export const USER_DATA_KEY = "svfs_user";

export const getStoredUser = () => {
  try {
    const user = JSON.parse(window.localStorage.getItem(USER_DATA_KEY) || "null");
    const token = window.localStorage.getItem(USER_TOKEN_KEY);

    return token && user ? user : null;
  } catch {
    return null;
  }
};

export const saveUserSession = ({ token, user }) => {
  window.localStorage.setItem(USER_TOKEN_KEY, token);
  window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent("svfs-user-change", { detail: user }));
};

export const clearUserSession = () => {
  window.localStorage.removeItem(USER_TOKEN_KEY);
  window.localStorage.removeItem(USER_DATA_KEY);
  window.dispatchEvent(new CustomEvent("svfs-user-change", { detail: null }));
};
