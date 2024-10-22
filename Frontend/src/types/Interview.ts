import {Vacancy} from "./Vacancy.ts";
import {Student} from "./Student.ts";
import {VacancyResponse} from "./VacancyResponse.ts";

export type Interview = {
    id: string
    vacancy: Vacancy
    student: Student
    vacancyResponse: VacancyResponse
    dateTime: Date,
    result: 'Passed' | 'Failed' | 'Canceled' | 'DidNotCome'
}