import axios from 'axios';

const authClient = axios.create({
    baseURL: `${process.env.REACT_APP_AUTH_BASE_URL}/api`,
});

authClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default authClient;