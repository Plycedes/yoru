import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import Toast from "react-native-toast-message";

import DialogBox from "./DialogBox.jsx";

import { icons } from "../constants";
import { likeVideo, videoAlreadyLiked, unlikeVideo, deleteVideo } from "../lib/expressApi.js";
import { useGlobalContext } from "../context/GlobalProvider.js";

const VideoCard = ({
    video: {
        _id,
        title,
        thumbnail,
        video,
        creatorDetails: { _id: creatorId, username, avatar },
    },
}) => {
    const [play, setPlay] = useState(false);
    const [liked, setLiked] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isDialogVisible, setDialogVisible] = useState(false);

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
        Toast.show({
            type: "success",
            text1: "Bookmarked video",
        });
    };

    const unlikeCurrentVideo = async () => {
        await unlikeVideo({ videoId: _id });
        Toast.show({
            type: "success",
            text1: "Unmarked video",
        });
    };

    const deleteCurrentVideo = async () => {
        try {
            await deleteVideo({ vidId: _id });
            Toast.show({
                type: "success",
                text1: "Successfully deleted video",
            });
        } catch (error) {
            Toast.show({
                type: "success",
                text1: `Error: ${error.message}`,
            });
        }
    };

    const showDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    return (
        <View className="flex-col items-center px-4 mb-5">
            <DialogBox
                isVisible={isDialogVisible}
                title="Are you sure you want to delete this video?"
                onConfirm={deleteCurrentVideo}
                closeDialog={closeDialog}
            />
            <View className="flex-row gap-3 items-start">
                <View className="justify-center items-center flex-row flex-1">
                    <View
                        className="w-[46px] h-[46px] rounded-lg border border-secondary
                    justify-center items-center p-0.5"
                    >
                        <Image
                            source={{ uri: avatar }}
                            className="w-full h-full rounded-lg"
                            resizeMode="cover"
                        />
                    </View>
                    <View className="justify-center flex-1 ml-3 gap-y-1">
                        <Text className="text-white font-psemibold text-sm" numberOfLines={1}>
                            {title}
                        </Text>
                        <Text className="text-gray-100 font-pregular text-xs" numberOfLines={1}>
                            {username}
                        </Text>
                    </View>
                </View>
                <View className="pt-2 relative">
                    <TouchableOpacity
                        onPress={() => setShowDropdown(!showDropdown)}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: icons.menu }}
                            className="w-5 h-5"
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
                            {user._id === creatorId && (
                                <TouchableOpacity className="px-4 py-2" onPress={showDialog}>
                                    <Text className="text-white text-sm">Delete video</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
            {play ? (
                <VideoView
                    className="rounded-xl w-full h-60"
                    player={player}
                    contentFit="cover"
                    nativeControls
                    allowsPictureInPicture
                    allowsFullscreen
                />
            ) : (
                <TouchableOpacity
                    className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => {
                        setPlay(true);
                        player.play();
                    }}
                >
                    <Image
                        source={{ uri: thumbnail }}
                        className="w-full h-full rounded-xl mt-3"
                        resizeMode="cover"
                    />
                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default VideoCard;
