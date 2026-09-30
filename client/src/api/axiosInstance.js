import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken");

      if (!refreshToken) {
        clearAuthentication();
        return Promise.reject(error);
      }

      try {
        const refreshResponse = await axios.post(
          "http://127.0.0.1:8000/auth/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken =
          refreshResponse.data.access;

        localStorage.setItem(
          "accessToken",
          newAccessToken
        );

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearAuthentication();

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


function clearAuthentication() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}



export default axiosInstance;
