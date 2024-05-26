"use client";

import {useContext} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";

export default function HomePage() {
    const context = useContext(AuthContext) as AuthContextType;

    return <h1>Home {context.user}</h1>
}
