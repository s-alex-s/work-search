"use client";

import React, {createContext, useEffect, useState} from "react";
import {getUser, UserDataType} from "@/utils/auth";

const AuthContext = createContext({});

export default AuthContext;

export type AuthContextType = {
    loading: boolean;
    user: UserDataType | null;
    setUser: (user: UserDataType | null) => void;
};

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState<null | UserDataType>(null);
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        if (isUserLoading) {
            getUser().then((val) => {
                setUser(val);
                    setIsUserLoading(false);
                }
            );
        }
    }, []);

    const contextData: AuthContextType = {
        loading: isUserLoading,
        user: user,
        setUser: setUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
