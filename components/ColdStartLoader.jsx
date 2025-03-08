import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const ColdStartLoader = ({
    visible,
    message = "Server is starting up...",
    subMessage = "This may take up to a minute",
    retryCount = 0,
    maxRetries = 7,
}) => {
    if (!visible) return null;

    const progressPercentage = Math.min((retryCount / maxRetries) * 100, 100);

    return (
        <View className="absolute w-full h-full inset-0 z-50 flex items-center justify-center bg-black/70">
            <View className="bg-gray-900 rounded-xl p-8 mx-6 items-center shadow-lg border border-gray-800">
                <View className="mb-6 h-24 w-24 rounded-full bg-gray-800 items-center justify-center">
                    <ActivityIndicator size="large" color="primary" />
                </View>

                <Text className="text-xl font-bold text-center text-white mb-2">{message}</Text>

                <Text className="text-sm text-center text-gray-400 mb-4">{subMessage} Hello</Text>

                <Text className="text-xs text-gray-500 mt-2">
                    {retryCount > 0
                        ? `Attempt ${retryCount} of ${maxRetries}`
                        : "First load may take longer"}
                </Text>

                <Text className="text-secondary font-medium text-center mt-4">
                    Please wait while we connect
                </Text>
            </View>
        </View>
    );
};

export default ColdStartLoader;
