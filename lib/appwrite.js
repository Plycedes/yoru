import { ID, Account, Client, Avatars, Databases, Query, Storage } from "react-native-appwrite";

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.blacksteel.yoru",
    projectId: "67792e1e0024e383dae4",
    databaseId: "6779308d0039d0f84011",
    userCollectionId: "677930b6002154536ef3",
    videoCollectionId: "67793101003c60d76662",
    likesCollectionId: "678641e5001b5c0ae2a0",
    storageId: "6779330e000a5fde565f",
};
const {
    endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    likesCollectionId,
    storageId,
} = config;

const client = new Client();

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);

        if (!newAccount) throw new Error();

        const avatarUrl = avatars.getInitials(username);

        await signIn(email, password);

        const newUser = await databases.createDocument(databaseId, userCollectionId, ID.unique(), {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl,
        });

        return newUser;
    } catch (error) {
        console.log("Error creating the new user:", error);
        throw new Error(error);
    }
};

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log("Error signing in:", error);
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(databaseId, userCollectionId, [
            Query.equal("accountId", currentAccount.$id),
        ]);
        if (!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log("Error fetching current account", error);
    }
};

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt"),
        ]);
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.orderDesc("$createdAt", Query.limit(7)),
        ]);
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.search("title", query),
        ]);
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(databaseId, videoCollectionId, [
            Query.equal("creator", userId),
            Query.orderDesc("$createdAt"),
        ]);
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
};

export const signOut = async () => {
    try {
        const session = await account.deleteSession("current");
        return session;
    } catch (error) {
        throw new Error(error);
    }
};

const getFilePreview = async (fileId, type) => {
    let fileUrl;

    try {
        if (type === "video") {
            fileUrl = storage.getFileView(storageId, fileId);
        } else if (type === "image") {
            fileUrl = storage.getFilePreview(storageId, fileId, 2000, 2000, "top", 100);
        } else {
            throw new Error("Invalid file type");
        }

        if (!fileUrl) throw Error;

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

const uploadFile = async (file, type) => {
    if (!file) return;

    const asset = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    };

    try {
        const uploadedFile = await storage.createFile(storageId, ID.unique(), asset);

        const fileUrl = await getFilePreview(uploadedFile.$id, type);

        return fileUrl;
    } catch (error) {
        throw new Error(error);
    }
};

export const createVideo = async (form) => {
    try {
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(form.thumbnail, "image"),
            uploadFile(form.video, "video"),
        ]);

        const newPost = await databases.createDocument(databaseId, videoCollectionId, ID.unique(), {
            title: form.title,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            prompt: form.prompt,
            creator: form.userId,
        });

        return newPost;
    } catch (error) {
        throw new Error(error);
    }
};

export const likeVideo = async (userId, videoId) => {
    try {
        const existingLikes = await databases.listDocuments(databaseId, likesCollectionId, [
            Query.equal("userId", userId),
            Query.equal("videoId", videoId),
        ]);
        console.log("Liking video", userId, videoId);
        if (existingLikes.total > 0) {
            console.log("Video already liked");
            return;
        }

        const newLike = await databases.createDocument(databaseId, likesCollectionId, ID.unique(), {
            userId: userId,
            videoId: videoId,
        });

        return newLike;
    } catch (error) {
        throw new Error(error);
    }
};

export const videoAlreadyLiked = async (userId, videoId) => {
    try {
        const existingLikes = await databases.listDocuments(databaseId, likesCollectionId, [
            Query.equal("userId", userId),
            Query.equal("videoId", videoId),
        ]);

        if (existingLikes.total > 0) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw new Error(error);
    }
};

export const unlikeVideo = async (userId, videoId) => {
    try {
        const response = await databases.listDocuments(databaseId, likesCollectionId, [
            Query.equal("userId", userId),
            Query.equal("videoId", videoId),
        ]);

        if (response.total > 0) {
            const likeId = response.documents[0].$id;
            await databases.deleteDocument(databaseId, likesCollectionId, likeId);
            console.log("Successfully removed like");
        } else {
            console.log("Like not found");
        }
    } catch (error) {
        throw new Error(error);
    }
};
