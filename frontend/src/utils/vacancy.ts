"use server";

export type VacancyType = {
    id: number;
    title: string;
    salary: number;
    salary_currency: string;
    company: string;
    requirements: string;
    created_at: string;
    description: string;
};

export type VacancyFormType = {
    title?: string;
    salary?: number;
    salary_currency?: string;
    company?: string;
    requirements?: string;
    description?: string;
};

export type VacancyEditType = {
    id: number;
    title?: string;
    salary?: number;
    salary_currency?: string;
    company?: string;
    requirements?: string;
    description?: string;
};

export async function get_vacancies(token: string, link?: string) {
    let response = await fetch(
        link ?? 'http://localhost:8000/api/vacancies/get/',
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
        'http://localhost:8000/api/vacancy/',
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
