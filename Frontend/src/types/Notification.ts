export type Notification = {
    id: string
    receiver: string
    type: NotificationType
    jsonData: string
    isRead: boolean
}

export enum NotificationType {
    FreeForm,
    NewVacancy,
}