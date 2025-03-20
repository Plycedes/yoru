import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

const Comments = ({ isVisible, comments }) => {
    return (
        <View className="px-4 flex-col">
            <View className="flex-row justify-between  items-center mb-2">
                <Text className="text-white font-pmedium">Comments</Text>
                <TouchableOpacity onPress={() => isVisible(false)}>
                    <Image
                        source={{
                            uri: "https://img.icons8.com/?size=100&id=6483&format=png&color=F25081",
                        }}
                        className="w-8 h-8"
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Comments;
