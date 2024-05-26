"use client";

import React, {createContext, useEffect, useState} from "react";
import {getUser} from "@/utils/auth";

const AuthContext = createContext({});

export default AuthContext;

export type AuthContextType = {
    loading: boolean;
    update: () => void;
    user: string;
};

export function AuthProvider({children}: { children: React.ReactNode }) {
    const [user, setUser] = useState("");
    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        if (isUserLoading) {
            getUser().then((val) => {
                    // @ts-ignore
                    setUser(val?.name);
                    setIsUserLoading(false);
                }
            );
        }
    });

    function updateUsername() {
        setIsUserLoading(true);
    }

    const contextData: AuthContextType = {
        loading: isUserLoading,
        update: updateUsername,
        user: user,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}
