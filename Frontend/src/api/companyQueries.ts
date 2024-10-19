import {API_URL} from "../consts.ts";
import {Company} from "../types/Company.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export const getCompanyProfile = async (token: string, id: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/Company/get/${id}`, {
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

export const updateCompanyProfile = async (token: string, id: string, login: string, new_password: string, name: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Company/info`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id, name, login, password: new_password})
    });

    if (!response.ok) {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}