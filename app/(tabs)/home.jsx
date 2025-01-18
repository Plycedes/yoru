import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import Trending from "../../components/Trending";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { images } from "../../constants";
import { getAllPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";

import { useGlobalContext } from "../../context/GlobalProvider";

// import { useVideoPlayer, VideoView } from "expo-video";

const Home = () => {
    const { data: posts, isLoading, refetch } = useAppwrite(getAllPosts);
    const { data: latestPosts } = useAppwrite(getAllPosts);
    const { user } = useGlobalContext();

    const [refreshing, setRefreshing] = useState(false);

    // const videoSrc =
    //     "http://res.cloudinary.com/dxsffcg6l/video/upload/v1737113332/gmco9e6tewposzyxbbie.mp4";

    // const player = useVideoPlayer({ uri: videoSrc }, (player) => {
    //     player.play();
    // });

    const onRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };
    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
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
            {/* <VideoView player={player} className="w-full h-60" /> */}
        </SafeAreaView>
    );
};

export default Home;
