import {API_URL} from "../consts.ts";
import {Company} from "../types/Company.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export const getCompanyProfile = async (token: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/Company/info`, {
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

export const updateCompanyProfile = async (token: string, name: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Company/info`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({name})
    });

    if (!response.ok) {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}