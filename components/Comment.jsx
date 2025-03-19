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
                <View className="flex-row flex-1 justify-between">
                    <Text className="text-md font-psemibold text-white">Username</Text>
                    <TouchableOpacity onPress={() => {}} activeOpacity={0.7}>
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
