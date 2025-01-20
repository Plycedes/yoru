import { ScrollView, Image, Text, View, Alert } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";

import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButtom from "../../components/CustomButton";

import { loginUser, getCurrentUser } from "../../lib/expressApi.js";
import { useGlobalContext } from "../../context/GlobalProvider";
import useAxios from "../../lib/useAxios.js";

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
        }
        setSubmitting(true);
        try {
            console.log("Submit");
            //const { data: user } = useAxios(() => loginUser(form));
            const user = await loginUser(form);

            setUser(user);
            setIsLoggedIn(true);

            router.replace("/home");
        } catch (error) {
            Alert.alert("Error", error.message);
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
