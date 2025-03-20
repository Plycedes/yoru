import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosRetry from "axios-retry";

const apiClient = axios.create({
    baseURL: "https://yoru-backend.onrender.com/api/v1",
    withCredentials: true,
    timeout: 80000,
});

// const apiClient = axios.create({
//     baseURL: "https://localhost:8000/api/v1",
//     withCredentials: true,
//     timeout: 80000,
// });

// const apiClient = axios.create({
//     baseURL: "http://34.132.67.217:8000/api/v1",
//     //withCredentials: true,
//     timeout: 120000,
// });

axiosRetry(apiClient, {
    retries: 7,
    retryDelay: () => {
        return 10000;
    },
    retryCondition: (error) => {
        return axios.isNetworkError(error) || (error.response && error.response.status >= 500);
    },
    onRetry: (retryCount, error, requestConfig) => {
        console.log(`Retry attempt #${retryCount} for ${requestConfig.url}`);
        // You could trigger a notification to the user here
    },
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

export const wakeUpServer = async (onRetryCallback = null) => {
    let retryCount = 0;
    let isServerReady = false;

    const attemptWakeUp = async () => {
        try {
            await apiClient.get("/", { timeout: 10000 });
            isServerReady = true;
            return true;
        } catch (error) {
            console.log(`Server wake-up attempt ${retryCount + 1} failed:`, error.message);
            retryCount++;
            if (onRetryCallback) {
                onRetryCallback(retryCount);
            }
            if (retryCount >= 7) {
                return false;
            }
            await new Promise((resolve) => setTimeout(resolve, 10000));
            return await attemptWakeUp();
        }
    };

    const result = await attemptWakeUp();

    return {
        isServerReady: result,
        retryCount,
    };
};

export const loginUser = async (data) => {
    try {
        const response = await apiClient.post("/users/login", data);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const registerUser = async (data) => {
    try {
        await apiClient.post("/users/register", data);
    } catch (error) {
        throw error;
    }
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
    const formData = new FormData();

    // Append the text fields
    formData.append("title", data.form.title);
    formData.append("prompt", data.form.prompt);

    // Append the files
    formData.append("thumbnail", {
        uri: data.form.thumbnail.uri,
        name: data.form.thumbnail.name,
        type: data.form.thumbnail.type,
    });

    formData.append("video", {
        uri: data.form.video.uri,
        name: data.form.video.name,
        type: data.form.video.type,
    });

    try {
        const response = await apiClient.post("/videos/create-video", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("Error creating video:", error.message);
        throw error;
    }
};

export const deleteVideo = async (data) => {
    try {
        await apiClient.post("/videos/delete-video", data);
    } catch (error) {
        throw error;
    }
};

export const getVideo = async (data) => {
    try {
        const response = await apiClient.post("/videos/get-video", data);
        return response;
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

export const getLikedPosts = () => {
    return apiClient.get("/videos/get-liked-videos");
};

export const searchPosts = (query) => {
    return apiClient.get(`/videos/search-videos?query=${query}&page=1&limit=10`);
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
        await apiClient.post("/likes/delete-like", data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const createComment = async (data) => {
    try {
        await apiClient.post("/comments/create-comment", data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const editComment = async (data) => {
    try {
        await apiClient.post("/comments/edit-comment", data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const deleteComment = async (data) => {
    try {
        await apiClient.post("/comments/delete-comment", data);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export const getAllComments = async (data) => {
    try {
        const response = await apiClient.post("/comments/get-comments", data);
        return response.data.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
};
