"use client";

import {useContext, useEffect, useState} from "react";
import AuthContext, {AuthContextType} from "@/context/auth";
import {useRouter} from "next/navigation";
import Loading from "@/app/loading";
import {getUserOrLogout} from "@/utils/client_auth";

export default function HomePage() {
    const context = useContext(AuthContext) as AuthContextType;
    const router = useRouter();

    const [isUserLoading, setIsUserLoading] = useState(true);

    useEffect(() => {
        getUserOrLogout(context, router).then(r => {
            if (r) {
                setIsUserLoading(false);
            }
        });
    }, []);

    if (isUserLoading) return <Loading/>
    return <h1>Home {context.user?.username}</h1>
}
