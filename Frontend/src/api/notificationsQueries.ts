import {API_URL} from "../consts.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";
import {Notification} from "../types/Notification.ts";

export type GetAllNotificationsForStudentBody = {
    token: string
}

export const getAllNotificationsForStudent = async ({token}: GetAllNotificationsForStudentBody): Promise<Notification[]> => {
    const response = await fetch(`${API_URL}/Notifications/get-all`, {
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

export const markRead = async ({id, token}: {id: string, token: string}) => {
    const res = await fetch(`${API_URL}/Notifications/mark-read/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const error: ApiErrorResponse = await res.json();
        throw new Error(error.detail);
    }
}