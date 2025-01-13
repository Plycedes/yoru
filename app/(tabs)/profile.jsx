import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import InfoBox from "../../components/InfoBox";
import EmptyState from "../../components/EmptyState";
import VideoCard from "../../components/VideoCard";

import { getUserPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import { icons } from "../../constants";

import { useGlobalContext } from "../../context/GlobalProvider";

const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext();
    const { data: posts, isLoading, refetch } = useAppwrite(() => getUserPosts(user.$id));

    return (
        <SafeAreaView className="bg-primary h-full">
            <FlatList
                data={posts}
                keyExtractor={(item) => item.$id}
                renderItem={({ item }) => <VideoCard video={item} />}
                ListHeaderComponent={() => (
                    <View className="w-full justify-center items-center mt-6 mb-12 px-4">
                        <View className="w-full items-end">
                            <TouchableOpacity
                                className="mb-10"
                                onPress={() => console.log("Logout")}
                            >
                                <Image
                                    source={icons.logout}
                                    resizeMode="contain"
                                    className="w-6 h-6"
                                />
                            </TouchableOpacity>
                        </View>
                        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
                            <Image
                                source={{ uri: user?.avatar }}
                                className="w-[90%] h-[90%] rounded-lg"
                                resizeMode="cover"
                            />
                        </View>

                        <InfoBox title={user?.username} containerStyles="mt-5" titleStyles="text-lg"/>

                        <View className="mt-5 flex-row">
                            
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

export default Profile;
