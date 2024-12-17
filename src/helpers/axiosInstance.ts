import axios from "axios"

const axiosInstance = axios.create({
    baseURL: "/api",
    withCredentials: true,
});
// axiosInstance.interceptors.request.use((config) => {
//     const token =
//         cookies().get("next-auth.session-token") ||
//         localStorage.getItem("token");
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

export default axiosInstance;
