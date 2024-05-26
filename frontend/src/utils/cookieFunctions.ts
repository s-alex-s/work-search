"use server";

import "server-only";
import {cookies} from "next/headers";
import {RequestCookie} from "next/dist/compiled/@edge-runtime/cookies";
import {DEFAULT_LIFETIME} from "@/config";

export async function getCookie(key: string): Promise<RequestCookie | undefined> {
    return cookies().get(key);
}

export async function setCookie(key: string, value: string, lifetime: number = DEFAULT_LIFETIME): Promise<void> {
    cookies().set(key, value, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: new Date(Date.now() + lifetime)
    });
}

export async function deleteCookie(key: string): Promise<void> {
    cookies().delete(key);
}
