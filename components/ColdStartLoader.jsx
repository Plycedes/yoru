import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Animated, Dimensions } from "react-native";
import { useTailwind } from "nativewind";

const ColdStartLoader = ({
    visible,
    message = "Server is starting up...",
    subMessage = "This may take up to a minute",
}) => {
    const tailwind = useTailwind();
    const opacity = React.useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.timing(opacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [visible, opacity]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                tailwind("absolute inset-0 z-50 flex items-center justify-center bg-black/70"),
                { opacity },
            ]}
        >
            <View style={tailwind("bg-white rounded-xl p-8 mx-6 items-center shadow-lg")}>
                <View
                    style={tailwind(
                        "mb-6 h-24 w-24 rounded-full bg-blue-50 items-center justify-center"
                    )}
                >
                    <ActivityIndicator size="large" color="#3b82f6" />
                </View>

                <Text style={tailwind("text-xl font-bold text-center text-gray-800 mb-2")}>
                    {message}
                </Text>

                <Text style={tailwind("text-sm text-center text-gray-500 mb-4")}>{subMessage}</Text>

                <View style={tailwind("w-full bg-gray-200 rounded-full h-2.5 mb-1")}>
                    <Animated.View
                        style={[
                            tailwind("bg-blue-500 h-2.5 rounded-full"),
                            {
                                width: opacity.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0%", "100%"],
                                }),
                            },
                        ]}
                    />
                </View>

                <Text style={tailwind("text-xs text-gray-400 mt-2")}>
                    First load may take longer
                </Text>
            </View>
        </Animated.View>
    );
};

// Usage example
export const AppWithLoader = ({ children }) => {
    const [isLoading, setIsLoading] = React.useState(false);

    // Example of how you might use this with your API client
    React.useEffect(() => {
        const interceptor = apiClient.interceptors.request.use((config) => {
            setIsLoading(true);
            return config;
        });

        const responseInterceptor = apiClient.interceptors.response.use(
            (response) => {
                setIsLoading(false);
                return response;
            },
            (error) => {
                if (error.config && error.config.__retryCount) {
                    // Show loader only during retries
                    setIsLoading(true);
                } else if (!error.config || error.config.__retryCount === undefined) {
                    setIsLoading(false);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            apiClient.interceptors.request.eject(interceptor);
            apiClient.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    return (
        <View style={{ flex: 1 }}>
            {children}
            <ColdStartLoader
                visible={isLoading}
                message="Waking up the server"
                subMessage="Your request is being processed"
            />
        </View>
    );
};

export default ColdStartLoader;
