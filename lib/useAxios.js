import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

const useAxios = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fn();
            if (response.data.data.data) {
                setData(response.data.data.data);
            } else {
                //console.log(response.data.data);
                setData(response.data.data);
            }
        } catch (error) {
            Alert.alert(error || "Something went wrong");
        } finally {
            setIsLoading(true);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const refetch = () => fetchData();

    return { data, isLoading, refetch };
};

export default useAxios;
