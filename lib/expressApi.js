import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const apiClient = axios.create({
    baseURL: "https://yoru-backend.vercel.app/api/v1",
    withCredentials: true,
    timeout: 120000,
});

apiClient.interceptors.request.use(
    async function (config) {
        const token = await AsyncStorage.getItem("token");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export const loginUser = (data) => {
    return apiClient.post("/users/login", data);
};

export const registerUser = (data) => {
    return apiClient.post("/users/register", data);
};

export const logoutUser = () => {
    return apiClient.post("/users/logout");
};

export const getCurrentUser = () => {
    return apiClient.post("/users/current-user");
};
