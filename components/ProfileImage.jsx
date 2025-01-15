import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-toast-message";

import { icons } from "../constants";
import { updateUserPfp } from "../lib/appwrite";
import { useGlobalContext } from "../context/GlobalProvider";

const ProfileImage = ({ image, setShow }) => {
    const [uploadImg, setUploadImg] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { user } = useGlobalContext();

    const openPicker = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploadImg(result.assets[0]);
        }
    };

    const handlePfpUpdate = async () => {
        console.log("Updating pfp");
        setUploading(true);
        await openPicker();

        if (!uploadImg) {
            // Toast.show({
            //     type: "success",
            //     text1: "Please a select an image",
            // });
            console.log("Select an image");
        }

        try {
            await updateUserPfp(uploadImg, user);
        } catch (error) {
            // Toast.show({
            //     type: "success",
            //     text1: error,
            // });
            console.log("Some error occured while updating pfp", error);
        } finally {
            setUploading(false);
            //setUploadImg("");
        }
        console.log(uploadImg);
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
