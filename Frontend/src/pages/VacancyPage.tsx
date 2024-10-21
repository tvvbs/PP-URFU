import Header from "../components/Header.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";
import {useQuery} from "@tanstack/react-query";
import {getVacancy} from "../api/vacancyQueries.ts";
import {useParams} from "react-router";

const VacancyPage = () => {

    return (
        <main>
            <Header/>
            <VacancyComponent/>
        </main>
    );
};

const VacancyComponent = () => {
    const {id} = useParams<{id: string}>();
    const {token} = useAuth();

    const {data: vacancy, error: vacancyError, isLoading: vacancyIsLoading} = useQuery({
        queryFn: () => getVacancy(token!, id!),
        queryKey: ['vacancy', id],
    })

    if (vacancyIsLoading) {
        return <div>Загрузка...</div>
    }

    if (vacancyError) {
        return <div>Ошибка: {vacancyError.message}</div>
    }

    return (
        <div className="bg-white shadow-md rounded p-4">
            <h2 className="text-lg font-bold mb-4">Vacancy {vacancy!.id}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Название вакансии
                    </label>
                    <p className="text-gray-700 text-sm" id="name">{vacancy!.name}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="positionName">
                        Позиция
                    </label>
                    <p className="text-gray-700 text-sm" id="positionName">{vacancy!.positionName}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="incomeRub">
                        Зарплата
                    </label>
                    <p className="text-gray-700 text-sm" id="incomeRub">{vacancy!.incomeRub} ₽</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Описание вакансии
                    </label>
                    <p className="text-gray-700 text-sm" id="description">{vacancy!.description}</p>
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyId">
                        Company ID
                    </label>
                    <p className="text-gray-700 text-sm" id="companyId">{vacancy!.companyId}</p>
                </div>
            </div>
        </div>
    );
};

export default VacancyPage;