import { View, Text, FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { getLikedPosts } from "../../lib/expressApi.js";

import { useState } from "react";
import useAxios from "../../lib/useAxios.js";

const Bookmark = () => {
    const [refreshing, setRefreshing] = useState(false);

    const { data: posts, isLoading, refetch } = useAxios(() => getLikedPosts());

    const handleRequest = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="w-full mt-6 mb-12 px-4">
                        <Text className="text-2xl text-white font-psemibold">Bookmarks</Text>
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

export default Bookmark;
