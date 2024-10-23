import {Student} from "./Student.ts";
import {Vacancy} from "./Vacancy.ts";

export type VacancyReview = {
    id: string
    student: Student
    vacancy: Vacancy
    rating: Rating
    text: string
}


export enum Rating {
    One = 1,
    Two,
    Three,
    Four,
    Five
}