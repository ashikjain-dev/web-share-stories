import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_USER_SERVICE_URL || 'https://sharestories.in/api/v1/users/',
    withCredentials: true,
});

export const taskApi = axios.create({
    baseURL: import.meta.env.VITE_TASK_SERVICE_URL || 'https://sharestories.in/api/v1/tasks/',
    withCredentials: true,
});

// Helper to handle rate limit errors
const handleRateLimit = (error) => {
    if (error.response && error.response.status === 429) {
        const friendlyMessage = "Whoa, slow down! You're moving a bit too fast. Please try again in a minute.";

        // 1. Update the error message directly
        error.message = friendlyMessage;

        // 2. Inject into response data so Contexts catch it automatically
        if (error.response.data) {
            // Support both formats used by User and Task services
            error.response.data.data = friendlyMessage;
            error.response.data.msg = friendlyMessage;
        } else {
            error.response.data = { data: friendlyMessage, msg: friendlyMessage };
        }
    }
    return Promise.reject(error);
};

api.interceptors.response.use(response => response, handleRateLimit);
taskApi.interceptors.response.use(response => response, handleRateLimit);

export default api;
