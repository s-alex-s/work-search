"use server";

import {deleteCookie, getCookie, setCookie} from "@/utils/cookieFunctions";
import {cache} from "react";
import {ACCESS_TOKEN_LIFETIME, REFRESH_TOKEN_LIFETIME} from "@/config";

export type UserDataType = {
    first_name: string,
    last_name: string,
    email: string,
    birth_date: string,
    gender: string,
    id: number,
    username: string,
    token: string,
}

export async function deleteUser(token: string, current_password: string): Promise<boolean> {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/me/',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token,
            },
            body: JSON.stringify({
                'current_password': current_password
            })
        }
    );

    return response.ok;
}

export async function retrieveUserData(access: string): Promise<UserDataType> {
    let user_data = await fetch(
        'http://localhost:8000/api/auth/users/me/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + access
            }
        }
    );
    return {...await user_data.json(), token: access};
}

export async function getUser(): Promise<UserDataType | null> {
    const access_cookie = await getCookie('access');
    const refresh_cookie = await getCookie('refresh');
    const token = await verifyToken(access_cookie?.value);

    if (!token) {
        const update_token_data = await updateToken(refresh_cookie?.value);

        if (!update_token_data) {
            return null;
        }

        return await retrieveUserData(update_token_data.access);
    }

    return await retrieveUserData(token);
}

export async function registerUser(values: {
    first_name: string,
    last_name: string,
    birth_date: string,
    gender: 'm' | 'f',
    username: string,
    email: string,
    password: string,
    re_password: string
}): Promise<object | null> {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'first_name': values.first_name,
                'last_name': values.last_name,
                'birth_date': values.birth_date,
                'gender': values.gender,
                'username': values.username,
                'email': values.email,
                'password': values.password,
                're_password': values.re_password,
            })
        }
    );

    if (response.status === 400) {
        return await response.json();
    }
    return null;
}

export async function loginUser(values: { username: string, password: string }): Promise<UserDataType | null> {
    let response = await fetch(
        'http://localhost:8000/api/auth/jwt/create/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'username': values.username,
                'password': values.password
            }),
        }
    );

    let data = await response.json();

    if (response.ok) {
        await setCookie('access', data.access, ACCESS_TOKEN_LIFETIME);
        await setCookie('refresh', data.refresh, REFRESH_TOKEN_LIFETIME);

        return await retrieveUserData(data.access);
    }

    return null
}

export async function updateToken(refresh: string | undefined): Promise<{
    access: string,
    refresh: string
} | null> {
    if (!refresh) return null;

    let response = await fetch(
        'http://localhost:8000/api/auth/jwt/refresh/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'refresh': refresh
            }),
        }
    );

    if (response.ok) {
        const data = await response.json();

        await setCookie('access', data.access, ACCESS_TOKEN_LIFETIME);
        await setCookie('refresh', data.refresh, REFRESH_TOKEN_LIFETIME);

        return data;
    }
    return null;
}

export async function logoutUser(): Promise<void> {
    await deleteCookie('access');
    await deleteCookie('refresh');
}

let verifyToken = cache(async (token: string | undefined): Promise<string | null> => {
    if (!token) return null;

    let response = await fetch(
        'http://localhost:8000/api/auth/jwt/verify/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'token': token
            }),
        }
    );

    if (response.ok) return token;

    return null;
});

export async function resendActivation(email: string) {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/resend_activation/',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        }
    );

    return response.ok;
}

export async function userActivate(uid: string, token: string) {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/activation/',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'uid': uid,
                'token': token
            })
        }
    );

    return response.ok;
}

export async function reset_password(email: string) {
    const response = await fetch(
        'http://localhost:8000/api/auth/users/reset_password/',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email})
        }
    );
    return {ok: response.ok, status: response.status};
}

export async function reset_password_confirm(
    uid: string,
    token: string,
    new_password: string,
    re_new_password: string) {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/reset_password_confirm/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                uid: uid,
                token: token,
                new_password: new_password,
                re_new_password: re_new_password
            })
        }
    );
    return response.ok;
}

export async function forgot_username(email: string) {
    const response = await fetch(
        'http://localhost:8000/api/auth/users/forgot_username/',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email})
        }
    );
    return {ok: response.ok, status: response.status};
}

export async function resend_activation_user(email: string) {
    const response = await fetch(
        'http://localhost:8000/api/auth/users/resend_activation/',
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email: email})
        }
    );
    return {ok: response.ok, status: response.status};
}

export async function change_user_info(
    token: string,
    first_name?: string,
    last_name?: string,
) {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/me/',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify({
                first_name: first_name,
                last_name: last_name,
            })
        }
    );

    return response.ok;
}

export async function change_user_password(
    new_password: string,
    re_new_password: string,
    current_password: string,
    token: string
) {
    let response = await fetch(
        'http://localhost:8000/api/auth/users/set_password/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify({
                new_password: new_password,
                re_new_password: re_new_password,
                current_password: current_password
            })
        }
    );
    if (response.ok) return null;
    return await response.json();
}
