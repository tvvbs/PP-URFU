import {Company} from "./Company.ts";

export type Vacancy = {
    id: string
    name: string,
    positionName: string
    incomeRub: number,
    description: string,
    company?: Company
}