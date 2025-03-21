import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView, Image } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { wakeUpServer } from "../lib/expressApi";

import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import ColdStartLoader from "../components/ColdStartLoader";
import { useGlobalContext } from "../context/GlobalProvider";

import "react-native-url-polyfill/auto";
import "react-native-get-random-values";

export default function App() {
    const { isLoading, isLoggedIn } = useGlobalContext();

    const [isColdStarting, setIsColdStarting] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        const initServer = async () => {
            setIsColdStarting(true);

            const { isServerReady } = await wakeUpServer((count) => {
                setRetryCount(count);
            });

            setIsColdStarting(!isServerReady);
        };

        initServer();
    }, []);

    if (!isLoading && isLoggedIn) return <Redirect href="/home" />;
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: "100%" }}>
                <View className="w-full mt-10 items-center min-h-[90vh] px-4">
                    <Image
                        source={images.logo2}
                        className="w-[150px] h-[47px]"
                        resizeMode="contian"
                    />
                    <Image
                        source={images.cards}
                        className="w-[380px] h-[300px]"
                        resizeMode="contian"
                    />
                    <View className="relative mt-5">
                        <Text
                            className="text-3xl text-white font-bold
                        text-center"
                        >
                            Experience Limitless Horizorns with
                            <Text className="text-secondary-100"> Yoru</Text>
                        </Text>

                        <Image
                            source={images.path}
                            className="w-[80px] h-[15px] absolute -bottom-2
                        -right-0"
                            resizeMode="contian"
                        />
                    </View>
                    <Text className="text-sm font-pregular text-gray-100 mt-6 text-center">
                        Step into a world of boundless opportunity and discover new perspectives you
                        never thought possible.
                    </Text>
                    <CustomButton
                        title="Continue with Email"
                        handlePress={() => router.push("/sign-in")}
                        containerStyles="w-full mt-7"
                    />
                </View>
            </ScrollView>
            <StatusBar backgroundColor="#161622" style="light" />
            <ColdStartLoader
                visible={isColdStarting}
                message="Waking up the server"
                subMessage="Your request is being processed"
                retryCount={retryCount}
                maxRetries={10}
            />
        </SafeAreaView>
    );
}
