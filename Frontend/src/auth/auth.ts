import {Role} from "../types/Role.ts";
import {API_URL} from "../consts.ts";
import {ApiErrorResponse, DefaultApiErrorResponse} from "../types/ApiErrorResponse.ts";

export async function login(email: string, password: string, role: Role): Promise<LoginResponse> {
    try {
        const loginResponse = await fetch(`${API_URL}/user/login-${role.toLowerCase()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: email, password})
        });

        if (loginResponse.ok) {
            const token = await loginResponse.json();

            const getIdRoleResponse = await fetch(`${API_URL}/user/current-role-and-id`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            if (getIdRoleResponse.ok) {
                const {id}: GetRoleAndIdResponse = await getIdRoleResponse.json();
                console.log(id)
                return {
                    token: token,
                    id: id,
                }
            } else {
                const res: ApiErrorResponse = await getIdRoleResponse.json();
                return {
                    error: res
                }
            }
        } else {
            const res: ApiErrorResponse = await loginResponse.json();
            return {
                error: res
            }
        }
    } catch {
        return {
            error: DefaultApiErrorResponse
        }
    }
}

type GetRoleAndIdResponse = {
    id: string,
    role: Role
}

export type LoginResponse = {
    token?: string,
    id?: string
    error?: ApiErrorResponse
}

export function getUserInfo(): GetUserInfoResponse {
    const role = localStorage.getItem('role') as Role | null;
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');

    return {
        role,
        token,
        id
    }
}

export type GetUserInfoResponse = {
    role: Role | null
    token: string | null
    id: string | null
}

export function saveUserInfo(role: Role, token: string, id: string) {
    localStorage.setItem('role', role);
    localStorage.setItem('token', token);
    localStorage.setItem('id', id);
}

export async function register_student(email: string, password: string, passwordConfirm: string, name: string, surname: string, patronymic?: string): Promise<RegisterStudentResult> {
    try {
        const res = await fetch(`${API_URL}/user/register-student`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: email, password, passwordRepeat: passwordConfirm, name, surname, patronymic})
        })

        if (res.ok) {
            return {
                success: true
            }
        } else {
            return {
                success: false,
                error: await res.json()
            }
        }
    } catch {
        return {
            success: false,
            error: {
                type: 'unknown',
                title: 'Unknown error',
                status: 500,
                detail: 'Что-то пошло не так'
            }
        }
    }
}

export type RegisterStudentResult = {
    success: boolean
    error?: ApiErrorResponse
}

export async function register_company(email: string, password: string, passwordConfirm: string, companyName: string): Promise<RegisterCompanyResult> {
    try {
        const res = await fetch(`${API_URL}/user/register-company`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({login: email, password, passwordRepeat: passwordConfirm, companyName})
        })

        if (res.ok) {
            return {
                success: true
            }
        } else {
            return {
                success: false,
                error: await res.json()
            }
        }
    } catch {
        return {
            success: false,
            error: {
                type: 'unknown',
                title: 'Unknown error',
                status: 500,
                detail: 'Что-то пошло не так'
            }
        }
    }
}

export type RegisterCompanyResult = {
    success: boolean
    error?: ApiErrorResponse
}