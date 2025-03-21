import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";

import { editComment } from "../lib/expressApi";

const EditComment = ({ commentId, refetch, ogComment, setVisible }) => {
    const [comment, setComment] = useState(ogComment);
    const [isLoading, setIsLoading] = useState(false);

    const handePress = async () => {
        try {
            setIsLoading(true);
            await editComment({ comment, commentId });
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
            setVisible(false);
        }
    };
    return (
        <View className="pb-4">
            <View
                className="border-1 border-black-200 w-full h-11 px-2 bg-black-100
                            rounded-xl focus:border-secondary items-center flex-row my-1"
            >
                <TextInput
                    className="flex-1 text-white font-pregular text-xs"
                    value={comment}
                    placeholder="Type your comment"
                    placeholderTextColor="#7b7b8b"
                    onChangeText={(e) => setComment(e)}
                />
            </View>
            <View className="flex-row gap-2">
                <TouchableOpacity
                    className={`bg-secondary rounded-lg w-20 h-8 mt-1 justify-center 
                                items-center ${isLoading ? "opacity-50" : ""}`}
                    disabled={isLoading}
                    onPress={handePress}
                >
                    <Text className="text-primary font-semibold">Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`bg-gray-600 rounded-lg w-20 h-8 mt-1 justify-center 
                                items-center ${isLoading ? "opacity-50" : ""}`}
                    disabled={isLoading}
                    onPress={() => setVisible(false)}
                >
                    <Text className="text-primary font-semibold">Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditComment;
