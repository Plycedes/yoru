import { createContext, useContext, useState, useEffect } from "react";

import { getCurrentUser } from "../lib/expressApi.js";

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
                } else {
                    setIsLoggedIn(false);
                    setUser(null);
                }
            } catch (error) {
                console.log(error);
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
