import { View, Text, TextInput } from "react-native";
import React, { useState } from "react";

const CreateComment = () => {
    const [comment, setComment] = useState();
    return (
        <View className="p-4">
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
        </View>
    );
};

export default CreateComment;
