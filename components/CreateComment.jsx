import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { createComment } from "../lib/expressApi";
import Toast from "react-native-toast-message";

const CreateComment = ({ videoId, refetch }) => {
    const [comment, setComment] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handePress = async () => {
        try {
            setIsLoading(true);
            await createComment({ comment, videoId });
            await refetch();
            Toast.show({
                type: "success",
                text1: `Comment added successfully`,
            });
        } catch (error) {
            Toast.show({
                type: "success",
                text1: `Error: ${error.message}`,
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View className="pb-4">
            <View
                className="border-1 border-black-200 w-full h-11 px-2 bg-black-100
                        rounded-xl focus:border-secondary items-center flex-row "
            >
                <TextInput
                    className="flex-1 text-white font-pregular text-xs mt-1"
                    value={comment}
                    placeholder="Type your comment"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setComment(e)}
                />
            </View>
            <TouchableOpacity
                className={`bg-secondary rounded-lg w-20 h-8 mt-1 justify-center 
                            items-center ${isLoading ? "opacity-50" : ""}`}
                disabled={isLoading}
                onPress={handePress}
            >
                <Text className="text-primary font-semibold">Comment</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreateComment;
