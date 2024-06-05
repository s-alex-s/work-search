"use server";

export type FeedbackType = {
    id?: number,
    resume: number,
    vacancy: number
};

export type FeedbackListType = {
    count: number,
    next: string,
    previous: string,
    results: FeedbackType[]
};

export async function create_feedback(token: string, data: FeedbackType):
    Promise<{ response: FeedbackType, status: boolean }> {

    let response = await fetch(
        'http://localhost:8000/api/feedback/create/',
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

export async function delete_feedback(token: string, id: number): Promise<boolean> {
    let response = await fetch(
        `http://localhost:8000/api/feedback/delete/${id}/`,
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

export async function get_feedbacks(token: string, link?: string): Promise<FeedbackListType> {
    let response = await fetch(
        link ?? 'http://localhost:8000/api/feedback/',
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
