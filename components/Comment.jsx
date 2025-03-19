import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";

import { icons } from "../constants";

const Comment = ({}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    return (
        <View className="flex-row mb-3 w-full gap-2 px-3">
            <View>
                <View className="w-[30px] h-[30px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image
                        source={{
                            uri: "https://img.icons8.com/?size=100&id=bIKEtXJBjGxo&format=png&color=F25081",
                        }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View className="flex-col flex-1">
                <View className="flex-row justify-between">
                    <Text className="text-md font-psemibold text-white">Username</Text>
                    {showDropdown && (
                        <View
                            className="absolute bottom-7 right-0 bg-gray-800 rounded-md shadow-lg z-10"
                            style={{ width: 150 }}
                        >
                            <TouchableOpacity
                                className="px-4 py-2"
                                onPress={() => {
                                    setShowDropdown(false);
                                }}
                            >
                                <Text className="text-white text-sm">Copy Prompt</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2"
                                onPress={() => {
                                    setShowDropdown(false);
                                }}
                            >
                                <Text className="text-white text-sm">Copy Prompt</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={() => {
                            setShowDropdown(!showDropdown);
                        }}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: icons.menu }}
                            className="w-4 h-4"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                <Text className="font-pregular font-sm text-white">This is a comment body</Text>
            </View>
        </View>
    );
};

export default Comment;
