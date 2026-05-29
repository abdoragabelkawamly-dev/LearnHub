import axios from "axios";

const API_ORIGIN = "http://e-learning-platform-3.runasp.net";

const getApiBasePath = () => {
  const configuredBasePath = import.meta.env.VITE_API_BASE_PATH || "";

  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    configuredBasePath.startsWith("http://")
  ) {
    return "";
  }

  if (
    typeof window !== "undefined" &&
    ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname) &&
    !configuredBasePath
  ) {
    return API_ORIGIN;
  }

  return configuredBasePath;
};

const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token");

const getStoredRefreshToken = () =>
  localStorage.getItem("refreshToken") || sessionStorage.getItem("refreshToken");

const getTokenStorage = () =>
  localStorage.getItem("refreshToken") ? localStorage : sessionStorage;

const api = axios.create({
  // Keep requests relative so Vercel/Vite can proxy HTTPS frontend calls to the HTTP API.
  baseURL: getApiBasePath(),
});


api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getStoredRefreshToken();

      if (refreshToken) {
        try {
          // Wrap the refreshToken string in quotes or send as object depending on backend expectation
          // Backend is [FromBody] string refreshToken, so it expects a JSON string
          const response = await axios.post(
            `${api.defaults.baseURL}/api/Account/RefreshToken`,
            JSON.stringify(refreshToken),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          const storage = getTokenStorage();

          storage.setItem("token", accessToken);
          storage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("refreshToken");
          sessionStorage.removeItem("user");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
