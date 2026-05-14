const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const assetUrl = (value) => {
  if (!value || typeof value !== "string") {
    return value;
  }

  if (value.startsWith("http") || value.startsWith("data:")) {
    return value;
  }

  return `${API_ORIGIN}${value.startsWith("/") ? value : `/${value}`}`;
};

export const apiRequest = async (path, options = {}) => {
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("API request failed", { url, status: response.status, result });
      throw new Error(result.message || "Request failed");
    }

    return result;
  } catch (error) {
    console.error("API fetch error", { url, message: error.message, error });
    throw error;
  }
};

export const authRequest = async (path, body) => {
  return apiRequest(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const authorizedRequest = async (path, options = {}) => {
  const token = window.localStorage.getItem("svfs_user_jwt");
  const url = `${API_BASE_URL}${path}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });
    const result = await response.json();

    if (!response.ok) {
      console.error("Authorized API request failed", { url, status: response.status, result });
      throw new Error(result.message || "Request failed");
    }

    return result;
  } catch (error) {
    console.error("Authorized API fetch error", { url, message: error.message, error });
    throw error;
  }
};
