import {Student} from "./Student.ts";
import {Vacancy} from "./Vacancy.ts";

export type VacancyReview = {
    id: string
    student: Student
    vacancy: Vacancy
    rating: Rating
    comment: string
}


export enum Rating {
    One = 0,
    Two = 1,
    Three = 2,
    Four= 3,
    Five= 4,
}