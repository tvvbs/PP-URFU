import {Interview, InterviewResult} from "../types/Interview.ts";
import {API_URL} from "../consts.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export type GetInterviewsForStudentBody = {
    token: string
    studentId: string
}

export const getAllInterviewsForStudent = async ({
                                                     token,
                                                     studentId
                                                 }: GetInterviewsForStudentBody): Promise<Interview[]> => {
    const res = await fetch(`${API_URL}/Interview/get-all-for-student/${studentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (res.ok) {
        return await res.json()
    } else {
        throw new Error((await res.json() as ApiErrorResponse).detail);
    }
}

export type GetAllInterviews = {
    token: string
}

export const getAllInterviews = async ({token}: GetAllInterviews): Promise<Interview[]> => {
    const res = await fetch(`${API_URL}/Interview/get-all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (res.ok) {
        return await res.json()
    } else {
        throw new Error((await res.json() as ApiErrorResponse).detail);
    }
}

export type UpdateInterviewStateBody = {
    token: string,
    interviewId: string,
    result: InterviewResult
}

export const updateInterviewState = async ({token, interviewId, result}: UpdateInterviewStateBody): Promise<void> => {
    const res = await fetch(`${API_URL}/Interview/change-result/${interviewId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({result})
    });

    if (!res.ok) {
        throw new Error((await res.json() as ApiErrorResponse).detail);
    }
}