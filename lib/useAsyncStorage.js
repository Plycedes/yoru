import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useAsyncStorage = (key) => {
    const [storedValue, setStoredValue] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadValue = async () => {
            try {
                const value = await AsyncStorage.getItem(key);
                if (value !== null) {
                    setStoredValue(JSON.parse(value));
                }
            } catch (error) {
                console.error(`Error loading key "${key}":`, error);
            } finally {
                setLoading(false);
            }
        };

        loadValue();
    }, [key]);

    const setValue = async (value) => {
        try {
            const valueToStore = typeof value === "function" ? value(storedValue) : value;
            await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
            setStoredValue(valueToStore);
        } catch (error) {
            console.error(`Error setting key "${key}":`, error);
        }
    };

    const removeValue = async () => {
        try {
            await AsyncStorage.removeItem(key);
            setStoredValue(null);
        } catch (error) {
            console.error(`Error removing key "${key}":`, error);
        }
    };

    return [storedValue, setValue, removeValue, loading];
};

export default useAsyncStorage;
