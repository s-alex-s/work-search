"use client";

import {useContext} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";

export default function HomePage() {
    const context = useContext(AuthContext) as AuthContextType;

    if (context.user) {
        return <h1>Home {context.user.name}</h1>
    }
    return <h1>Home</h1>
}
