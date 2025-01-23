import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const apiClient = axios.create({
//     baseURL: "https://yoru-backend.vercel.app/api/v1",
//     withCredentials: true,
//     timeout: 120000,
// });

const apiClient = axios.create({
    baseURL: "http://34.132.67.217:8000/api/v1",
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

export const logoutUser = async () => {
    try {
        await apiClient.post("/users/logout");
    } catch (error) {
        console.log(error);
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get("/users/current-user");
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const updateUserPfp = async (data) => {
    const formData = new FormData();

    formData.append("avatar", {
        uri: data.avatar.uri,
        name: data.avatar.fileName,
        type: data.avatar.mimeType,
    });

    try {
        const response = await apiClient.post("/users/update-avatar", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
};

export const createVideo = async (data) => {
    console.log(data.form);
    try {
        const response = await apiClient.post("/videos/create-video", data.form, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw error;
    }
};

export const getAllPosts = () => {
    return apiClient.get("/videos/get-all-videos");
};

export const getUserPosts = () => {
    return apiClient.get("/videos/get-user-videos");
};

export const getLikedPosts = () => {
    return apiClient.get("/videos/get-liked-videos");
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
        const response = await apiClient.post("/likes/delete-like", data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};
