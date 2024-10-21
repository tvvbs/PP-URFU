import { useState } from "react";
import Header from "../components/Header.tsx";
import { useQuery } from "@tanstack/react-query";
import { getVacancies } from "../api/vacansionsQueries.ts";
import { Link } from "react-router-dom";
import { VACANCIES_ROUTE } from "../routes.tsx";
import { useAuth } from "../auth/AuthProvider.tsx";

const MainPage = () => {
    return (
        <main>
            <Header title="Вакансии" />
            <VacanciesList />
        </main>
    );
};

const VacanciesList = () => {
    const { token } = useAuth();
    const { data, isLoading, error } = useQuery({
        queryFn: () => getVacancies(token!),
        queryKey: ['vacancies']
    });

    const [nameFilter, setNameFilter] = useState('');
    const [positionFilter, setPositionFilter] = useState('');
    const [minIncome, setMinIncome] = useState('');
    const [maxIncome, setMaxIncome] = useState('');

    if (isLoading) {
        return <div className="text-center text-lg md:text-xl lg:text-2xl">Загрузка...</div>;
    }

    if (error) {
        return <div className="text-center text-lg text-red-500 md:text-xl lg:text-2xl">Error: {error.message}</div>;
    }

    // Filtering logic
    const filteredVacancies = data?.filter(vacancy => {
        const matchesName = vacancy.name.toLowerCase().includes(nameFilter.toLowerCase());
        const matchesPosition = vacancy.positionName?.toLowerCase().includes(positionFilter.toLowerCase());
        const matchesIncome =
            (minIncome === '' || vacancy.incomeRub >= Number(minIncome)) &&
            (maxIncome === '' || vacancy.incomeRub <= Number(maxIncome));

        return matchesName && matchesPosition && matchesIncome;
    });

    return (
        <div className="container mx-auto p-4 md:p-6 lg:p-8 border border-gray-300 rounded-md shadow-md">
            {/* Filters */}
            <div className="mb-4 grid grid-cols-2 md:grid-cols-4 gap-y-3">
                <input
                    type="text"
                    placeholder="Фильтр по названию"
                    value={nameFilter}
                    onChange={e => setNameFilter(e.target.value)}
                    className="border rounded-md p-2 mr-2"
                />
                <input
                    type="text"
                    placeholder="Фильтр по позиции"
                    value={positionFilter}
                    onChange={e => setPositionFilter(e.target.value)}
                    className="border rounded-md p-2 mr-2"
                />
                <input
                    type="number"
                    placeholder="Мин доход"
                    value={minIncome}
                    onChange={e => setMinIncome(e.target.value)}
                    className="border rounded-md p-2 mr-2"
                />
                <input
                    type="number"
                    placeholder="Макс доход"
                    value={maxIncome}
                    onChange={e => setMaxIncome(e.target.value)}
                    className="border rounded-md p-2"
                />
            </div>

            {/* Vacancy list */}
            {filteredVacancies?.length === 0 ? (
                <div className="text-center text-lg md:text-xl lg:text-2xl">Вакансий нет</div>
            ) : (
                filteredVacancies!.map(vacancy => (
                    <div key={vacancy.id}
                         className="border border-gray-200 p-4 md:p-6 lg:p-8 rounded-md shadow-md mb-4">
                        <h2 className="text-lg font-bold md:text-xl lg:text-2xl mb-2">{vacancy.name}</h2>
                        <p className="text-gray-600 md:text-lg lg:text-xl mb-4">{vacancy.incomeRub}₽</p>
                        <Link to={`${VACANCIES_ROUTE}/${vacancy.id}`}
                              className="text-blue-500 hover:text-blue-700 md:text-lg lg:text-xl">
                            Перейти к вакансии
                        </Link>
                    </div>
                ))
            )}
        </div>
    );
};

export default MainPage;
