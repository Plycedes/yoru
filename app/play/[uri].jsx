import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { useEffect, useState } from "react";
import useAxios from "../../lib/useAxios.js";
import { getAllPosts, getVideo } from "../../lib/expressApi.js";
import { useLocalSearchParams } from "expo-router";

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
        await refetch();
        setRefreshing(false);
    };
    console.log(video);

    return (
        <SafeAreaView className="bg-primary h-full">
            {/* <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="w-full mt-6 mb-12 px-4">
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
            /> */}
        </SafeAreaView>
    );
};

export default PlayVideo;
