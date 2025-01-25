import { View, Text, FlatList } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { searchPosts } from "../../lib/expressApi.js";
import useAxios from "../../lib/useAxios.js";

import { useLocalSearchParams } from "expo-router";

const Search = () => {
    const { query } = useLocalSearchParams();
    const { data: posts, isLoading, refetch } = useAxios(() => searchPosts(query));

    useEffect(() => {
        refetch();
    }, [query]);
    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="my-6 px-4">
                        <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
                        <Text className="text-xl font-psemibold text-white">{query}</Text>

                        <View className="mt-6 mb-8">
                            <SearchInput initialQuery={query} />
                        </View>
                    </View>
                )}
                ListEmptyComponent={() => (
                    <EmptyState
                        title="No Videos Found"
                        subtitle="No search results found for this query"
                    />
                )}
            />
        </SafeAreaView>
    );
};

export default Search;
