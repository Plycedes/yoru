import { View, Text, Image, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useState } from "react";

import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { getUserPosts, getBookmarksCount, signOut } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";

import { useGlobalContext } from "../../context/GlobalProvider";
import ProfileImage from "../../components/ProfileImage";

const Profile = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [showImg, setShowImg] = useState(false);
    const { user, setUser, setIsLoggedIn } = useGlobalContext();

    const { data: posts, refetch: refetchPosts } = useAppwrite(() => getUserPosts(user.$id));
    const { data: bookmarks, refetch: refetchBookmarks } = useAppwrite(() =>
        getBookmarksCount(user.$id)
    );

    const logout = async () => {
        await signOut();
        setUser(null);
        setIsLoggedIn(false);
        router.replace("/sign-in");
    };

    const handleRequest = async () => {
        setRefreshing(true);
        await refetchPosts();
        await refetchBookmarks();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            {showImg && <ProfileImage image={user?.avatar} setShow={setShowImg} />}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <View className="w-full items-end">
                            <TouchableOpacity
                                className="flex-row items-center mb-10"
                                onPress={logout}
                            >
                                <Text className="text-gray-200 font-psemibold text-lg">Logout</Text>
                                <Image
                                    source={{ uri: icons.logout }}
                                    resizeMode="contain"
                                    className="w-8 h-8"
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => setShowImg(true)}>
                            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                                <Image
                                    source={{ uri: user?.avatar }}
                                    className="w-[90%] h-[90%] rounded-lg"
                                    resizeMode="cover"
                                />
                            </View>
                        </TouchableOpacity>

                        <InfoBox
                            title={user?.username}
                            containerStyles="mt-5"
                            titleStyles="text-lg"
                        />

                        <View className="mt-5 flex-row">
                            <InfoBox
                                title={posts.length || 0}
                                subtitle="Posts"
                                containerStyles="mr-10"
                                titleStyles="text-lg"
                            />
                            <InfoBox
                                title={bookmarks || 0}
                                subtitle="Bookmarks"
                                containerStyles=""
                                titleStyles="text-lg"
                            />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No search results found for this query"
                    />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRequest} />
                }
            />
        </SafeAreaView>
    );
};

export default Profile;
