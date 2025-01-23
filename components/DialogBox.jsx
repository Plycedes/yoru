import React, { useState } from "react";
import { View, Button, Alert } from "react-native";
import ConfirmationDialog from "./ConfirmationDialog";

const App = () => {
    const [isDialogVisible, setDialogVisible] = useState(false);

    const handleConfirm = () => {
        Alert.alert("Confirmed", "You clicked Yes.");
    };

    const handleCancel = () => {
        Alert.alert("Cancelled", "You clicked No.");
    };

    const showDialog = () => {
        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Button title="Open Confirmation" onPress={showDialog} />

            <ConfirmationDialog
                isVisible={isDialogVisible}
                title="Do you want to proceed?"
                onConfirm={handleConfirm}
                onCancel={handleCancel}
                closeDialog={closeDialog}
            />
        </View>
    );
};

export default App;
