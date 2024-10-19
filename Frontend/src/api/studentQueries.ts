import {API_URL} from "../consts.ts";
import {Student} from "../types/Student.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

export const getStudentProfile = async (id: string, token: string): Promise<Student> => {
    const response = await fetch(`${API_URL}/Student/get/${id}`, {
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

export const updateStudentProfile = async (token: string, id: string, login: string, new_password: string, name: string, surname: string, patronymic: string): Promise<void> => {
    const response = await fetch(`${API_URL}/Student/edit`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({id, login, password: new_password, name, surname, patronymic})
    });

    if (!response.ok) {
        const res: ApiErrorResponse = await response.json();
        throw new Error(res.detail);
    }
}
