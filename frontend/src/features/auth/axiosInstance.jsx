import axios from 'axios';


export const axiosInstance = axios.create({
  baseURL: 'https://localhost:8000',
  withCredentials: true,
});

export const setupAxiosInterceptors = (relog, logout, getAccessToken) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = getAccessToken(); // вызываем функцию, чтобы получить актуальный токен
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await relog;

          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await logout;
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;