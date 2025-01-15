import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { icons } from "../constants";

const ProfileImage = ({ image, setShow }) => {
    const [uploadImg, setUploadImg] = useState("");
    const [uploading, setUploading] = useState(false);

    const openPicker = async (selectType) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUploadImg(result.assets[0]);
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
                <TouchableOpacity>
                    <Image source={{ uri: icons.edit }} className="w-8 h-8" resizeMode="contain" />
                </TouchableOpacity>
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
