import {Rating, VacancyReview} from "../types/Review.ts";
import {API_URL} from "../consts.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export const getReviewsForVacancy = async ({vacancyId, token}: {vacancyId: string, token: string}): Promise<VacancyReview[]> => {
    const res = await fetch(`${API_URL}/Vacancy/reviews/${vacancyId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (res.ok) {
        return await res.json()
    } else {
        const error: ApiErrorResponse = await res.json();
        throw new Error(error.detail);
    }
}


export type SendReviewForVacancyBody = {
    token: string,
    vacancyId: string,
    comment: string,
    rating: Rating
    studentId: string
}
export const sendReviewForVacancy = async (body: SendReviewForVacancyBody): Promise<void> => {
    const res = await fetch(`${API_URL}/Vacancy/add-review`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${body.token}`
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        throw await res.json()
    }
}