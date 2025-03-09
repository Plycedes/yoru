import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const Loader = ({ visible, message = "Loading...", subMessage = "Please wait" }) => {
    if (!visible) return null;

    return (
        <View className="absolute w-full h-full inset-0 z-50 flex items-center justify-center bg-black/70">
            <View className="bg-gray-900 rounded-xl p-8 mx-6 items-center shadow-lg border border-gray-800">
                <View className="mb-6 h-24 w-24 rounded-full bg-gray-800 items-center justify-center">
                    <ActivityIndicator size="large" color="primary" />
                </View>

                <Text className="text-xl font-bold text-center text-white mb-2">{message}</Text>

                <Text className="text-sm text-center text-gray-400 mb-4">{subMessage}</Text>
            </View>
        </View>
    );
};

export default Loader;
