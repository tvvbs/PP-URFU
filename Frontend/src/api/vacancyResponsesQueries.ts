import {API_URL} from "../consts.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";
import {VacancyResponse, VacancyResponseStatus} from "../types/VacancyResponse.ts";

export type SendResumeBody = {
    token: string,
    studentId: string,
    vacancyId: string,
    text: string
    file: File
}

export const sendResume = async (body: SendResumeBody): Promise<void> => {
    const formData = new FormData();
    formData.append('studentId', body.studentId);
    formData.append('vacancyId', body.vacancyId);
    formData.append('text', body.text);
    formData.append('resume', body.file);

    const response = await fetch(`${API_URL}/Company/respond-to-vacancy`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${body.token}`,
        },
        body: formData
    });

    if (!response.ok) {
        throw await response.json();
    }
}


export const getAllVacancyResponses = async ({token}: { token: string }): Promise<VacancyResponse[]> => {
    const response = await fetch(`${API_URL}/VacancyResponses/get-all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return await response.json()
    } else {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}

export type GetResponsesForStudentBody = {
    token: string,
    studentId: string
}

export const getVacancyResponsesForStudent = async ({
                                                        token,
                                                        studentId
                                                    }: GetResponsesForStudentBody): Promise<VacancyResponse[]> => {
    const response = await fetch(`${API_URL}/VacancyResponses/get-for-student/${studentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (response.ok) {
        return await response.json()
    } else {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}

export type EditVacancyResponseBody = {
    token: string,
    vacancyResponseId: string,
    newStatus: VacancyResponseStatus
    interviewTime?: Date
}

export const editVacancyResponse = async (body: EditVacancyResponseBody) => {

    const res = await fetch(`${API_URL}/Company/edit-vacancy-response-status`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${body.token}`
            },
            body: JSON.stringify({responseId: body.vacancyResponseId, status: body.newStatus, dateTime: body.interviewTime?.toISOString()}),
        });

    if (!res.ok) {
        const error: ApiErrorResponse = await res.json();
        throw new Error(error.detail);
    }
}