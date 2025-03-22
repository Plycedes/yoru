import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import Toast from "react-native-toast-message";
import * as Clipboard from "expo-clipboard";

import { icons } from "../constants";
import { likeVideo, videoAlreadyLiked, unlikeVideo, follow, unfollow } from "../lib/expressApi.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

const VideoPlayer = ({
    video: {
        _id,
        title,
        thumbnail,
        video,
        prompt,
        creatorDetails: { _id: creatorId, username, avatar },
        followersCount,
        isFollowing,
        likesCount,
    },
    refetch,
}) => {
    const [play, setPlay] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { user } = useGlobalContext();

    const player = useVideoPlayer({ uri: video });

    useEffect(() => {
        (async () => {
            const result = await videoAlreadyLiked({ videoId: _id });
            setLiked(result);
        })();
    });

    const likeCurrentVideo = async () => {
        await likeVideo({ videoId: _id, creatorId });
        await refetch();
        Toast.show({
            type: "success",
            text1: "Bookmarked video",
        });
    };

    const unlikeCurrentVideo = async () => {
        await unlikeVideo({ videoId: _id });
        await refetch();
        Toast.show({
            type: "success",
            text1: "Unmarked video",
        });
    };

    const copyPrompt = async () => {
        await Clipboard.setStringAsync(prompt);
    };

    const followUser = async () => {
        try {
            setIsLoading(true);
            await follow({ followed: creatorId });
            await refetch();
            Toast.show({
                type: "success",
                text1: `Following @${username}`,
            });
        } catch (error) {
            Toast.show({
                type: "success",
                text1: `Error: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
            setVisible(false);
        }
    };

    const unfollowUser = async () => {
        try {
            setIsLoading(true);
            await unfollow({ followed: creatorId });
            await refetch();
            Toast.show({
                type: "success",
                text1: `Unfollowed @${username}`,
            });
        } catch (error) {
            Toast.show({
                type: "success",
                text1: `Error: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
            setVisible(false);
        }
    };

    return (
        <View>
            {play ? (
                <VideoView
                    className=" w-full h-60"
                    player={player}
                    contentFit="cover"
                    nativeControls
                    allowsPictureInPicture
                    allowsFullscreen
                />
            ) : (
                <TouchableOpacity
                    className="w-full h-60  relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => {
                        setPlay(true);
                        player.play();
                    }}
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
            <View className="mx-4 my-2 flex-row justify-between">
                <View className="flex-col gap-1">
                    <Text className="text-white font-psemibold text-lg" numberOfLines={1}>
                        {title}
                    </Text>
                    <Text className="text-white font-pregular text-xs" numberOfLines={1}>
                        {likesCount} bookmarks
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={() => setShowDropdown(!showDropdown)}
                    activeOpacity={0.7}
                >
                    <Image
                        source={{ uri: icons.menu }}
                        className="w-5 h-5 mt-1"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                {/* Dropdown Menu */}
                {showDropdown && (
                    <View
                        className="absolute top-10 right-0 bg-gray-800 rounded-md shadow-lg z-10"
                        style={{ width: 150 }}
                    >
                        {!liked ? (
                            <TouchableOpacity
                                className="px-4 py-2"
                                onPress={async () => {
                                    setShowDropdown(false);
                                    await likeCurrentVideo();
                                }}
                            >
                                <Text className="text-white text-sm">Bookmark</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                className="px-4 py-2"
                                onPress={async () => {
                                    setShowDropdown(false);
                                    await unlikeCurrentVideo();
                                }}
                            >
                                <Text className="text-white text-sm">Unmark</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity className="px-4 py-2" onPress={copyPrompt}>
                            <Text className="text-white text-sm">Copy Prompt</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View className="flex-col items-center px-4 py-2 mb-5">
                <View className="flex-row gap-3 items-start ">
                    <View className="justify-center items-center flex-row flex-1">
                        <View
                            className="w-[36px] h-[36px] rounded-lg border border-secondary
                                       justify-center items-center p-0.5"
                        >
                            <Image
                                source={{ uri: avatar }}
                                className="w-full h-full rounded-lg"
                                resizeMode="cover"
                            />
                        </View>
                        <View className="justify-center flex-1 ml-3 gap-y-1">
                            <View className="flex-col">
                                <Text
                                    className="text-gray-100 font-psemibold text-md"
                                    numberOfLines={1}
                                >
                                    @{username}
                                </Text>
                                <Text
                                    className="text-gray-100 font-pregular text-xs"
                                    numberOfLines={1}
                                >
                                    {followersCount} followers
                                </Text>
                            </View>
                        </View>
                    </View>
                    {user._id !== creatorId && (
                        <View className="relative">
                            {isFollowing ? (
                                <TouchableOpacity
                                    className={`bg-gray-600 rounded-lg w-20 h-8 mt-1 justify-center 
                                items-center ${isLoading ? "opacity-50" : ""}`}
                                    disabled={isLoading}
                                    onPress={unfollowUser}
                                >
                                    <Text className="text-primary font-semibold">Unfollow</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    className={`bg-secondary rounded-lg w-20 h-8 justify-center 
                                items-center ${isLoading ? "opacity-50" : ""}`}
                                    disabled={isLoading}
                                    onPress={followUser}
                                >
                                    <Text className="text-primary font-semibold">Follow</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};

export default VideoPlayer;
