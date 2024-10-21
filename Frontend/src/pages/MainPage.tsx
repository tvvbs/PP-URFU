import Header from "../components/Header.tsx";
import {useQuery} from "@tanstack/react-query";
import {getVacancies} from "../api/vacansionsQueries.ts";
import {Link} from "react-router-dom";
import {VACANCIES_ROUTE} from "../routes.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";

const MainPage = () => {
    return (
        <main>
                <Header title="Вакансии"/>
                <VacanciesList/>
        </main>
    );
};

const VacanciesList = () => {
    const {token} = useAuth();

    const {data, isLoading, error} = useQuery({
        queryFn: () => getVacancies(token!),
        queryKey: ['vacancies']
    })

    if (isLoading) {
        return <div className="text-center text-lg md:text-xl lg:text-2xl">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center text-lg text-red-500 md:text-xl lg:text-2xl">Error: {error.message}</div>;
    }

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 border border-gray-300 rounded-md shadow-md">
            {data?.length === 0 && <div className="text-center text-lg md:text-xl lg:text-2xl">Вакансий нет</div>}
            {
                data!.map(vacancy => (
                    <div key={vacancy.id} className="border-b border-gray-200 py-4 md:py-6 lg:py-8">
                        <h2 className="text-lg font-bold md:text-xl lg:text-2xl">{vacancy.name}</h2>
                        <p className="text-gray-600 md:text-lg lg:text-xl">{vacancy.incomeRub}₽</p>
                        <Link to={`${VACANCIES_ROUTE}/${vacancy.id}`} className="text-blue-500 hover:text-blue-700 md:text-lg lg:text-xl">Перейти к вакансии</Link>
                    </div>
                ))
            }
        </div>
    );
}

export default MainPage;