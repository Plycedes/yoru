import { ScrollView, Image, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";

const SignIn = () => {
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full justify-center h-full
                px-4 my-6"
                >
                    <Image
                        source={images.logo2}
                        resizeMode="containe"
                        className="w-[120px] h-[37px]"
                    />
                    <Text
                        className="text-white text-2xl 
                    text-semibold font-psemibold
                    mt-10"
                    >
                        Log in to Yoru
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
