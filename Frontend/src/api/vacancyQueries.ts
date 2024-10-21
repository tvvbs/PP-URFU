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

export type UpdateVacancyBody = {
    token: string
    vacancyId: string
    vacancyName: string
    positionName: string
    incomeRub: number
    description: string
    companyId: string
}

export const updateVacancy =
    async (request: UpdateVacancyBody): Promise<void> => {
        console.log("Update query")
        const res = await fetch(`${API_URL}/Vacancy/edit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${request.token}`
            },
            body: JSON.stringify({
                id: request.vacancyId,
                name: request.vacancyName,
                positionName: request.positionName,
                incomeRub: request.incomeRub,
                description: request.description,
                companyId: request.companyId
            })
        });

        if (!res.ok) {
            throw new Error((await res.json() as ApiErrorResponse).detail);
        }
    }

export type DeleteVacancyBody = {
    token: string
    vacancyId: string
}
export const deleteVacancy = async ({token, vacancyId}: DeleteVacancyBody): Promise<void> => {
    const res = await fetch(`${API_URL}/Vacancy/delete/${vacancyId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error((await res.json() as ApiErrorResponse).detail);
    }
}