import axios from 'axios';

// 백엔드 API 주소 (환경변수로 관리하면 좋아)
const baseURL = import.meta.env.VITE_BACKEND_URL;

// 인스턴스 생성
const api = axios.create({
    baseURL: `https://${baseURL}`,
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
    },
});

// ✅ 요청 전에 토큰을 자동으로 붙이는 인터셉터
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
