import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://localhost:8000',
  withCredentials: true,
});

export const setupAxiosInterceptors = (updateAccessToken, logout) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = axiosInstance.accessToken;
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
          const res = await axiosInstance.post('/refresh-token');
          const { accessToken } = res.data;

          axiosInstance.accessToken = accessToken;
          updateAccessToken(accessToken);

          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          await logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};

export default axiosInstance;