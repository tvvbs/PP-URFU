import {Student} from "./Student.ts";
import {Vacancy} from "./Vacancy.ts";
import {File} from "./File.ts";

export type VacancyResponse = {
    id: string
    vacancy: Vacancy
    student: Student,
    status: VacancyResponseStatus
    text: string
    resume: File
}

export enum VacancyResponseStatus {
    Pending = 0,
    Declined = 1,
    InvitedToInterview = 2
}