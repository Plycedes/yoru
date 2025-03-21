import { View, Text, TouchableOpacity, Image, FlatList, RefreshControl } from "react-native";
import React from "react";

import Comment from "./Comment";
import CreateComment from "./CreateComment";
import EmptyState from "./EmptyState";

const Comments = ({ isVisible, comments, refreshing, refetch, videoId }) => {
    return (
        <View className="px-4 flex-col">
            <View className="flex-row justify-between  items-center mb-2">
                <Text className="text-white font-pmedium">Comments</Text>
                <TouchableOpacity onPress={() => isVisible(false)}>
                    <Image
                        source={{
                            uri: "https://img.icons8.com/?size=100&id=6483&format=png&color=F25081",
                        }}
                        className="w-8 h-8"
                    />
                </TouchableOpacity>
            </View>
            <FlatList
                data={comments}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <View className="mb-3">
                        <Comment comment={item} refetch={refetch} />
                    </View>
                )}
                ListHeaderComponent={() => <CreateComment videoId={videoId} refetch={refetch} />}
                ListEmptyComponent={() => (
                    <View className="flex mt-10 justify-center items-center">
                        <Text className="text-xl font-psemibold text-white">No comments found</Text>
                        <Text className="font-pmedium text-sm text-gray-100">
                            Be the first to write a comment
                        </Text>
                    </View>
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => await refetch()}
                    />
                }
            />
        </View>
    );
};

export default Comments;
