import { createContext, useContext, useState, useEffect } from "react";

import { getCurrentUser } from "../lib/expressApi.js";
import useAxios from "../lib/useAxios.js";

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await getCurrentUser();
                if (res) {
                    setIsLoggedIn(true);
                    setUser(res);
                    console.log("It works");
                }
            } catch (error) {
                if ([401, 403].includes(error?.response?.status)) {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                isLoading,
                user,
                setUser,
                setIsLoggedIn,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
