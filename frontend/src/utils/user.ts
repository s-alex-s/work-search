import {UserDataType} from "@/utils/auth";
import {BACKEND_URL} from "@/config";

export async function deleteUser(token: string, current_password: string): Promise<boolean> {
    let response = await fetch(
        BACKEND_URL + '/api/auth/users/me/',
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

export async function retrieveUserData(access: string): Promise<UserDataType | null> {
    let user_data = await fetch(
        BACKEND_URL + '/api/auth/users/me/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + access
            }
        }
    );

    if (user_data.ok) return {...await user_data.json(), token: access};
    return null;
}

export async function reset_password(email: string) {
    const response = await fetch(
        BACKEND_URL + '/api/auth/users/reset_password/',
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
        BACKEND_URL + '/api/auth/users/reset_password_confirm/',
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
        BACKEND_URL + '/api/auth/users/forgot_username/',
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
    data: {
        first_name?: string,
        last_name?: string,
    }
) {
    let response = await fetch(
        BACKEND_URL + '/api/auth/users/me/',
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(data)
        }
    );

    return response.ok;
}

export async function change_user_password(
    data: {
        new_password: string,
        re_new_password: string,
        current_password: string,
    },
    token: string
): Promise<object | null> {
    let response = await fetch(
        BACKEND_URL + '/api/auth/users/set_password/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(data)
        }
    );
    if (response.ok) return null;
    return await response.json();
}
