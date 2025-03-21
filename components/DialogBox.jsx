import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";

const DialogBox = ({ isVisible, title = "Are you sure?", onConfirm, closeDialog }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handlePress = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            closeDialog();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <View className="flex justify-center items-center">
            <Modal
                isVisible={isVisible}
                onBackdropPress={closeDialog}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <View className="w-full p-6 bg-gray-800 rounded-xl items-center">
                    <Text className="text-xl font-semibold mb-5 text-white text-center">
                        {title}
                    </Text>
                    <View className="flex-row justify-between w-full">
                        <TouchableOpacity
                            onPress={async () => {
                                setIsLoading(true);
                                await onConfirm();
                                closeDialog();
                            }}
                            activeOpacity={0.7}
                            disabled={isLoading}
                            className={`bg-secondary rounded-xl w-20 h-10
                                justify-center items-center 
                                ${isLoading ? "opacity-50" : ""}`}
                        >
                            <Text
                                className={`text-primary font-psemibold
                                    text-lg `}
                            >
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                closeDialog();
                            }}
                            activeOpacity={0.7}
                            className={`bg-gray-300 rounded-xl w-20 h-10
                                justify-center items-center`}
                        >
                            <Text
                                className={`text-primary font-psemibold
                                    text-lg}`}
                            >
                                No
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default DialogBox;
