"use server";

import {BACKEND_URL} from "@/config";

export type ResumeGetType = {
    id: number,
    phone_number: string,
    additional_contacts: string,
    profession: string,
    busyness: string,
    languages: string,
    education: string,
    country: string,
    work_experience: string,
    user_info: {
        first_name: string,
        last_name: string,
        birth_date: string,
        email: string
        gender: 'm' | 'f'
    }
};

export type ResumeFormType = {
    phone_number?: string,
    countryCode?: string,
    additional_contacts?: string,
    profession: string,
    busyness?: string,
    languages?: string,
    education?: string,
    country?: string,
    work_experience?: string
};

export type ResumeChangeType = {
    phone_number?: string,
    additional_contacts?: string,
    profession?: string,
    busyness?: string,
    languages?: string,
    education?: string,
    country?: string,
    work_experience?: string
};

export async function get_resume(token: string): Promise<ResumeGetType | null> {
    let response = await fetch(
        BACKEND_URL + '/api/resume/',
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    );
    if (response.ok) return await response.json();
    return null;
}

export async function get_resume_id(token: string, id: string): Promise<ResumeGetType | null> {
    let response = await fetch(
        BACKEND_URL + `/api/resume/${id}/`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    );
    if (response.ok) return await response.json();
    return null;
}

export async function create_resume(
    token: string, resume: ResumeFormType): Promise<{ response: ResumeGetType, status: boolean }> {
    let response = await fetch(
        BACKEND_URL + '/api/resume/create/',
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(resume)
        }
    );
    return {
        response: await response.json(),
        status: response.ok
    };
}

export async function change_resume(token: string, resume: ResumeChangeType):
    Promise<{ response: object, status: boolean }> {

    let response = await fetch(
        BACKEND_URL + '/api/resume/',
        {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(resume)
        }
    );

    return {response: await response.json(), status: response.ok};
}
