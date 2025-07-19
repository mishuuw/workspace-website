import axiosInstance from './axiosInstance';

export const register = async (credentials) => {
  const response = await axiosInstance.post('/register', credentials);
  return response; // Ожидается 200 
};

export const login = async (credentials) => {
  const response = await axiosInstance.post('/login', credentials);
  return response; // Ожидается { accessToken }
};

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const response = await axiosInstance.post('/refresh-token');
    const { token } = response.data;
    // Сохранить новый токен
    processQueue(null, token);
    return token;
  } catch (error) {
    processQueue(error);
    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
}