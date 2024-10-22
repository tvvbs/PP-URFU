import {Vacancy} from "./Vacancy.ts";
import {Student} from "./Student.ts";

export type Interview = {
    id: string
    vacancy: Vacancy
    student: Student
    vacancyResponse: VacancyResponse
    dateTime: Date,
    result: 'Passed' | 'Failed' | 'Canceled' | 'DidNotCome'
}

export type VacancyResponse = {
    id: string
    vacancy?: Vacancy
    student?: Student,
    Status: 'Pending' | 'Declined' | 'InvitedToInterview'
}