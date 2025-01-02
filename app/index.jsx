import { StatusBar } from "expo-status-bar";
import { Text, View, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    return (
        <SafeAreaView className="bg-primary h-full">
            <ScrollView contentContainerStyle={{ height: "100%" }}></ScrollView>
        </SafeAreaView>
    );
}
