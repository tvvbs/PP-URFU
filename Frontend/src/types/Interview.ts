import {Vacancy} from "./Vacancy.ts";
import {Student} from "./Student.ts";
import {VacancyResponse} from "./VacancyResponse.ts";

export type Interview = {
    id: string
    vacancy: Vacancy
    student: Student
    vacancyResponse: VacancyResponse
    dateTime: Date,
    result?: InterviewResult
}

export enum InterviewResult {
    Passed = 0,
    Failed = 1,
    Canceled = 2,
    DidNotCome = 3
}