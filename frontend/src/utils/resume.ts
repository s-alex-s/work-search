"use server";

export type ResumeType = {
    id: number,
    phone_number: string,
    additional_contacts: string,
    profession: string,
    busyness: string,
    languages: string,
    education: string,
    country: string,
    work_experience: string,
};

export type ResumeFormType = {
    phone_number: string,
    countryCode: string,
    additional_contacts: string,
    profession: string,
    busyness: string,
    languages: string,
    education: string,
    country: string,
    work_experience: string
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

export async function get_resume(token: string): Promise<ResumeType | null> {
    let response = await fetch(
        'http://localhost:8000/api/resume/',
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
    token: string, resume: ResumeFormType): Promise<{ response: ResumeType, status: boolean }> {
    let response = await fetch(
        'http://localhost:8000/api/resume/create/',
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
        'http://localhost:8000/api/resume/',
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
