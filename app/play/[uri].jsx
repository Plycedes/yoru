import { View, Text, FlatList, RefreshControl, BackHandler } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";
import VideoPlayer from "../../components/VideoPlayer.jsx";
import Comment from "../../components/Comment.jsx";

import { useEffect, useState } from "react";
import useAxios from "../../lib/useAxios.js";
import { getAllPosts, getVideo } from "../../lib/expressApi.js";
import { router, useLocalSearchParams } from "expo-router";
import CreateComment from "../../components/CreateComment.jsx";

const PlayVideo = () => {
    const [refreshing, setRefreshing] = useState(false);

    const { uri } = useLocalSearchParams();
    const { data: posts, isLoading, refetch } = useAxios(getAllPosts);

    const {
        data: video,
        isLoading: loadingVideo,
        refetch: refetchVideo,
    } = useAxios(getVideo, { videoId: uri });

    const handleRequest = async () => {
        setRefreshing(true);
        await refetchVideo();
        await refetch();
        setRefreshing(false);
    };

    useEffect(() => {
        const backAction = () => {
            router.replace("/home");
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, []);

    return (
        <SafeAreaView className="bg-primary h-full">
            {video.length > 0 && (
                <View className="mt-1">
                    <VideoPlayer video={video[0]} />
                </View>
            )}
            <CreateComment />
            <FlatList
                data={posts.filter((item) => item._id !== uri)}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="w-full mb-2 px-4">
                        <Text className="text-md text-white font-psemibold">
                            Recommended videos
                        </Text>
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

export default PlayVideo;
