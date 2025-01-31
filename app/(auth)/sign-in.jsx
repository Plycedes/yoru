import { ScrollView, Image, Text, View, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButtom from "../../components/CustomButton";

import { loginUser } from "../../lib/expressApi.js";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const { setUser, setIsLoggedIn } = useGlobalContext();

    const submit = async () => {
        if (!form.email || !form.password) {
            Alert.alert("Error", "Please fill in all the fields");
            return;
        }

        setSubmitting(true);
        console.log("Submitting login form with:", form);

        try {
            const user = await loginUser(form);

            console.log("Login successful:", user);

            setUser(user.user);
            setIsLoggedIn(true);
            await AsyncStorage.setItem("token", user.accessToken);

            router.replace("/home");
        } catch (error) {
            console.error("Login failed:", error);

            if (error.response) {
                console.error("Server responded with:", error.response.status, error.response.data);
                Alert.alert(
                    "Error",
                    `Server Error: ${error.response.status} - ${JSON.stringify(
                        error.response.data
                    )}`
                );
            } else if (error.request) {
                console.error("No response received from server:", error.request);
                Alert.alert(
                    "Error",
                    "Network error: No response from server. Check internet connection."
                );
            } else {
                console.error("Axios error:", error.message);
                Alert.alert("Error", `Request error: ${error.message}`);
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView>
                <View
                    className="w-full justify-center min-h-[90vh]
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
                    <FormField
                        title="Email"
                        value={form.email}
                        handleChangeText={(e) => setForm({ ...form, email: e })}
                        otherStyles="mt-7"
                        keyboardType="email-address"
                    />
                    <FormField
                        title="Password"
                        value={form.password}
                        handleChangeText={(e) => setForm({ ...form, password: e })}
                        otherStyles="mt-7"
                    />
                    <CustomButtom
                        title="Sign In"
                        handlePress={submit}
                        containerStyles="mt-7"
                        isLoading={submitting}
                    />
                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">
                            Don't have an account?
                        </Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">
                            Sign Up
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SignIn;
