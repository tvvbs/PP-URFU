import {Vacancy} from "../types/Vacancy.ts";
import {API_URL} from "../consts.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export const getVacancies= async (): Promise<Vacancy[]> => {
    const response = await fetch(`${API_URL}/Vacancy/all`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        return await response.json()
    } else {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}