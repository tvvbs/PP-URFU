import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";
import {API_URL} from "../consts.ts";
import {Vacancy} from "../types/Vacancy.ts";

export const createVacancy =
    async (token: string, name: string, description: string,
           positionName: string, incomeRub: string, companyId: string):
        Promise<ApiErrorResponse | undefined> => {
        console.log(companyId);
        const res = await fetch(`${API_URL}/Vacancy/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({name, description, positionName, incomeRub, companyId})
        });

        if (!res.ok) {
            return await res.json();
        }

    }

export const getVacancy = async (token: string, id: string): Promise<Vacancy> => {
    const res = await fetch(`${API_URL}/Vacancy/get/${id}`, {
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
