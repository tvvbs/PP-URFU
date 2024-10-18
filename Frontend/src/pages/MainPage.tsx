import Header from "../components/Header.tsx";
import {useQuery} from "@tanstack/react-query";
import {getVacancies} from "../api/vacansionsQueries.ts";
import {Link} from "react-router-dom";
import {VACANCIES_ROUTE} from "../routes.tsx";

const MainPage = () => {
    return (
        <main>
            <Header title="Вакансии"/>
            <VacanciesList/>
        </main>
    );
};

const VacanciesList = () => {
    const {data, isLoading, error} = useQuery({
        queryFn: () => getVacancies(),
        queryKey: ['vacancies']
    })


    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            {
                data!.map(vacancy => (
                    <div key={vacancy.id}>
                        <h2>{vacancy.name}</h2>
                        <p>{vacancy.incomeRub}</p>
                        <Link to={`${VACANCIES_ROUTE}/${vacancy.id}`}>Перейти к вакансии</Link>
                    </div>
                ))
            }
        </>

    );
}

export default MainPage;