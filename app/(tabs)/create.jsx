import { View, Text, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";

import { icons } from "../../constants";
import { createVideo } from "../../lib/expressApi.js";

const Create = () => {
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
    });

    const player = useVideoPlayer({ uri: form.video?.uri }, (player) => {});

    const openPicker = async (selectType) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            const metaData = {
                uri: result.assets[0].uri,
                name: result.assets[0].fileName,
                type: result.assets[0].mimeType,
            };
            if (selectType === "image") {
                setForm({ ...form, thumbnail: metaData });
            }

            if (selectType === "video") {
                setForm({ ...form, video: metaData });
            }
        }
    };

    const submit = async () => {
        if (!form.prompt || !form.title || !form.thumbnail || !form.video) {
            return Alert.alert("Please fill in all the fields");
        }

        setUploading(true);

        try {
            await createVideo({
                form,
            });

            Alert.alert("Success", "Post uploaded successfully");
            router.push("/home");
        } catch (error) {
            Alert.alert(("Error", error.message));
        } finally {
            setForm({
                title: "",
                video: null,
                thumbnail: null,
                prompt: "",
            });

            setUploading(false);
        }
    };

    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white font-psemibold">Upload Video Hello</Text>
                <FormField
                    title="Video Title"
                    value={form.title}
                    placeholder="Give your video an interesting title..."
                    handleChangeText={(e) => setForm({ ...form, title: e })}
                    otherStyles="mt-10"
                />

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">Upload Video</Text>
                    <TouchableOpacity onPress={() => openPicker("video")}>
                        {form.video ? (
                            <VideoView
                                className="rounded-xl w-full h-64"
                                player={player}
                                contentFit="cover"
                                allowsPictureInPicture
                                allowsFullscreen
                            />
                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                                    <Image
                                        source={{ uri: icons.upload }}
                                        resizeMode="contain"
                                        className="w-1/2 h-1/2"
                                    />
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                    <Text className="text-xs text-pregular text-gray-400">
                        Please choose a video file of size below 50 MB *
                    </Text>
                </View>

                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">Thumbnail Image</Text>
                    <TouchableOpacity onPress={() => openPicker("image")}>
                        {form.thumbnail ? (
                            <Image
                                source={{ uri: form.thumbnail.uri }}
                                resizeMode="cover"
                                className="w-full h-64 rounded-2xl"
                            />
                        ) : (
                            <View className="w-full h-14 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                                <Image
                                    source={{ uri: icons.upload }}
                                    resizeMode="contain"
                                    className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">
                                    Choose a file
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>

                <FormField
                    title="AI Prompt"
                    value={form.prompt}
                    placeholder="The prompt used to create this video"
                    handleChangeText={(e) => setForm({ ...form, prompt: e })}
                    otherStyles="mt-10"
                />

                <CustomButton
                    title="Submit& Publish"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={uploading}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default Create;
