import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { icons } from "../constants";
import { updateUserPfp } from "../lib/expressApi.js";
import { useGlobalContext } from "../context/GlobalProvider";

const ProfileImage = ({ image, setShow }) => {
    const [uploading, setUploading] = useState(false);
    const [localImage, setLocalImage] = useState(null);

    const { user } = useGlobalContext();

    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            return result.assets[0];
        }
        return null;
    };

    const handlePfpUpdate = async () => {
        setUploading(true);

        try {
            const selectedImage = await openPicker();

            if (!selectedImage) {
                console.log("Select an image");
                return;
            }
            await updateUserPfp({ avatar: selectedImage });

            Toast.show({
                type: "success",
                text1: "Changed Profile Image",
            });
        } catch (error) {
            //console.log("Some error occurred while updating pfp", error.response);
            Toast.show({
                type: "success",
                text1: "Some error occured",
            });
        } finally {
            setUploading(false);
        }
    };

    return (
        <View className="absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-sm z-50 mt-10 p-5">
            <View className="flex flex-row justify-between items-center">
                <TouchableOpacity onPress={() => setShow(false)}>
                    <Image
                        source={{ uri: icons.leftArrow }}
                        className="w-8 h-8"
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                {uploading ? (
                    <Image
                        source={{ uri: icons.loader }}
                        className="w-8 h-8"
                        resizeMode="contain"
                    />
                ) : (
                    <TouchableOpacity onPress={handlePfpUpdate}>
                        <Image
                            source={{ uri: icons.edit }}
                            className="w-8 h-8"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View className="p-2 flex items-center justify-center">
                <Image
                    source={{ uri: image }}
                    className="w-[60%] h-[60%] rounded-lg mt-20"
                    resizeMode="cover"
                />
            </View>
        </View>
    );
};

export default ProfileImage;
