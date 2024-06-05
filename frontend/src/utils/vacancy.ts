"use server";

export type VacancyType = {
    id: number;
    title: string;
    salary: number;
    salary_currency: string;
    company: string;
    country: string;
    requirements: string;
    created_at: string;
    description: string;
    feedback?: boolean
};

export type VacancyFormType = {
    title?: string;
    salary?: number;
    salary_currency?: string;
    company?: string;
    country?: string;
    requirements?: string;
    description?: string;
};

export type VacancyEditType = {
    id: number;
    title?: string;
    salary?: number;
    salary_currency?: string;
    company?: string;
    country?: string;
    requirements?: string;
    description?: string;
};

export type VacancyListType = {
    count: number,
    next: string,
    previous: string,
    results: VacancyType[]
};

export async function get_vacancies(token: string, link?: string): Promise<VacancyListType> {
    let response = await fetch(
        link ?? 'http://localhost:8000/api/vacancy/',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    );

    return await response.json();
}

export async function get_vacancy(token: string, id: string): Promise<VacancyType> {
    let response = await fetch(
        `http://localhost:8000/api/vacancy/${id}/`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    );

    return await response.json();
}

export async function create_vacancy(token: string, data: VacancyFormType):
    Promise<{ response: VacancyType, status: boolean }> {
    let response = await fetch(
        'http://localhost:8000/api/vacancy/create/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(data)
        }
    );

    return {response: await response.json(), status: response.ok};
}

export async function delete_vacancy(token: string, id: number):
    Promise<boolean> {
    let response = await fetch(
        `http://localhost:8000/api/vacancy/${id}/`,
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            }
        }
    );

    return response.ok;
}

export async function change_vacancy(token: string, data: VacancyEditType):
    Promise<{ response: VacancyType, status: boolean }> {
    let response = await fetch(
        `http://localhost:8000/api/vacancy/${data.id}/`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify(data)
        }
    );

    return {response: await response.json(), status: response.ok};
}

export async function search_vacancies(title: string, token: string, link?: string): Promise<VacancyListType> {
    let response = await fetch(
        link ?? 'http://localhost:8000/api/vacancy/search/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'JWT ' + token
            },
            body: JSON.stringify({title: title})
        }
    );

    return await response.json();
}
