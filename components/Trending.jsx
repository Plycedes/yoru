import { View, Text, FlatList, TouchableOpacity, ImageBackground, Image } from "react-native";
import React, { useState } from "react";
import * as Animatable from "react-native-animatable";
import { useVideoPlayer, VideoView } from "expo-video";

import { icons } from "../constants";

const zoomIn = {
    0: {
        scale: 0.8,
    },
    1: {
        scale: 1,
    },
};
const zoomOut = {
    0: {
        scale: 1,
    },
    1: {
        scale: 0.8,
    },
};

const TrendingItem = ({ activeItem, item }) => {
    const [play, setPlay] = useState(false);

    const player = useVideoPlayer({ uri: item.video });

    return (
        <Animatable.View
            className="mr-3"
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {play ? (
                <VideoView
                    className="rounded-xl w-52 h-72"
                    player={player}
                    contentFit="cover"
                    nativeControls
                    allowsPictureInPicture
                    allowsFullscreen
                />
            ) : (
                <TouchableOpacity
                    className="relative justify-center items-center"
                    activeOpacity={0.7}
                    onPress={() => {
                        setPlay(true);
                        player.play();
                    }}
                >
                    <ImageBackground
                        source={{ uri: item.thumbnail }}
                        className="w-52 h-72 rounded-[35px] mt-5 overflow-hidden shadow-lg shadow-black/40"
                        resizeMode="cover"
                    />
                    <Image
                        source={icons.play}
                        className="w-12 h-12 absolute"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
            )}
        </Animatable.View>
    );
};

const Trending = ({ posts }) => {
    const [activeItem, setActiveItem] = useState(posts[0]);

    const viewableItemsChanged = ({ viewableItems }) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    };
    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({ item }) => <TrendingItem activeItem={activeItem} item={item} />}
            horizontal
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70,
            }}
            contentOffset={{ x: 170 }}
        />
    );
};

export default Trending;
