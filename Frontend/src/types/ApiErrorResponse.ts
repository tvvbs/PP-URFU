export type ApiErrorResponse = {
    type: string,
    title: string,
    status: number,
    detail: string
}

export const DefaultApiErrorResponse: ApiErrorResponse = {
    type: 'unknown',
    title: 'Unknown error',
    status: 500,
    detail: 'Что-то пошло не так'
}