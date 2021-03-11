import axios from "axios";
import { getToken } from "./auth";

const axiosApi = axios.create({
    baseURL: "http://localhost:5000/"
});

axiosApi.interceptors.request.use(async config => {
    const token = getToken();
    if (token)
        config.headers.Authorization = `Bearer ${token}`;

    return config;
});

export default axiosApi;