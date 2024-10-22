import {Interview} from "../types/Interview.ts";
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