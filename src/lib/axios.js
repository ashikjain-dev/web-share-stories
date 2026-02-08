import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'https://sharestories.in/api/v1/users/',
    withCredentials: true,
});

export const taskApi = axios.create({
    baseURL: import.meta.env.VITE_TASK_SERVICE_URL || 'https://sharestories.in/api/v1/tasks/',
    withCredentials: true,
});

export default api;
