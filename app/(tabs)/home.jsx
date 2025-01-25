import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { images } from "../../constants";
import { getAllPosts } from "../../lib/expressApi.js";

import useAxios from "../../lib/useAxios.js";

import { useGlobalContext } from "../../context/GlobalProvider";

// import { useVideoPlayer, VideoView } from "expo-video";

const Home = () => {
    const { data: posts, isLoading, refetch } = useAxios(getAllPosts);
    const {
        data: latestPosts,
        isLoading: latestLoading,
        refetch: refetchLatest,
    } = useAxios(getAllPosts);
    const { user } = useGlobalContext();

    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        await refetchLatest();
        setRefreshing(false);
    };
    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4 space-y-6">
                        <View className="justify-between items-start flex-row mb-6">
                            <View>
                                <Text className="font-pmedium text-sm text-gray-100">
                                    Welcome Back
                                </Text>
                                <Text className="text-2xl font-psemibold text-white">
                                    {user?.username}
                                </Text>
                            </View>
                            <View className="mt-1.5">
                                <Image
                                    source={images.logoSmall}
                                    className="w-10 h-10"
                                    resizeMode="contian"
                                />
                            </View>
                        </View>
                        <SearchInput />
                        <View className="w-full flex-1 mb-5 h-full">
                            <Text className="text-gray-100 text-lg font-pregular mb-3">
                                Latest Videos
                            </Text>
                            <Trending posts={latestPosts ?? []} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="Be the first one to upload a video"
                    />
                )}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            />
        </SafeAreaView>
    );
};

export default Home;
