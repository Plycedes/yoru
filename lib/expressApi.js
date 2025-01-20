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

export const loginUser = async (data) => {
    try {
        const response = await apiClient.post("/users/login", data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = (data) => {
    return apiClient.post("/users/register", data);
};

export const logoutUser = () => {
    return apiClient.post("/users/logout");
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get("/users/current-user");
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getAllPosts = () => {
    return apiClient.get("/videos/get-all-videos");
};

export const getUserPosts = () => {
    return apiClient.get("/videos/get-user-videos");
};

export const getBookmarksCount = () => {
    return apiClient.get("/likes/get-likes-count");
};

export const videoAlreadyLiked = async (data) => {
    try {
        const response = await apiClient.post("/likes/already-liked", data);
        if (!response.data.data) {
            return false;
        } else {
            return true;
        }
    } catch (error) {
        throw error;
    }
};

export const likeVideo = async (data) => {
    try {
        await apiClient.post("/likes/create-like", data);
    } catch (error) {
        throw error;
    }
};

export const unlikeVideo = async (data) => {
    try {
        await apiClient.delete("/likes/delete-like", data);
    } catch (error) {
        throw error;
    }
};
