import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";

import { icons } from "../constants";
import { deleteComment } from "../lib/expressApi";
import { useGlobalContext } from "../context/GlobalProvider";

import EditComment from "./EditComment";
import DialogBox from "./DialogBox";

const Comment = ({
    comment: {
        _id,
        comment,
        writer: { _id: writerId, username, avatar },
    },
    refetch,
}) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const { user } = useGlobalContext();

    const closeDialog = () => setDeleteMode(false);

    const handePress = async () => {
        try {
            await deleteComment({ commentId: _id });
            await refetch();
            Toast.show({
                type: "success",
                text1: `Comment deleted successfully`,
            });
        } catch (error) {
            Toast.show({
                type: "success",
                text1: `Error: ${error.message}`,
            });
        }
    };

    return (
        <View className="flex-row w-full gap-2 px-3">
            <DialogBox
                isVisible={deleteMode}
                title="Are you sure you want to delete this comment?"
                onConfirm={handePress}
                closeDialog={closeDialog}
            />
            <View>
                <View className="w-[30px] h-[30px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image
                        source={{
                            uri: avatar,
                        }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                </View>
            </View>
            <View className="flex-col flex-1">
                <View className="flex-row justify-between">
                    <Text className="text-md font-psemibold text-white">@{username}</Text>
                    {showDropdown && (
                        <View
                            className="absolute bottom-7 right-0 bg-gray-800 rounded-md shadow-lg z-10"
                            style={{ width: 150 }}
                        >
                            {user._id == writerId && (
                                <TouchableOpacity
                                    className="px-4 py-2"
                                    onPress={() => {
                                        setEditMode(true);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text className="text-white text-sm">Edit Comment</Text>
                                </TouchableOpacity>
                            )}
                            {user._id == writerId && (
                                <TouchableOpacity
                                    className="px-4 py-2"
                                    onPress={() => {
                                        setDeleteMode(true);
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text className="text-white text-sm">Delete Comment</Text>
                                </TouchableOpacity>
                            )}
                            {user._id != writerId && (
                                <TouchableOpacity
                                    className="px-4 py-2"
                                    onPress={() => {
                                        setShowDropdown(false);
                                    }}
                                >
                                    <Text className="text-white text-sm">Copy Comment</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={() => {
                            setShowDropdown(!showDropdown);
                        }}
                        activeOpacity={0.7}
                    >
                        <Image
                            source={{ uri: icons.menu }}
                            className="w-4 h-4"
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                </View>
                {editMode ? (
                    <EditComment
                        commentId={_id}
                        refetch={refetch}
                        ogComment={comment}
                        setVisible={setEditMode}
                    />
                ) : (
                    <Text className="font-pregular font-sm text-white">{comment}</Text>
                )}
            </View>
        </View>
    );
};

export default Comment;
