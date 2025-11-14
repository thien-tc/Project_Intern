import axios from 'axios';

const api = axios.create({
  baseURL: 'https://localhost:7129/api', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// tự động gắn token vào header của mỗi request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)
export default api;