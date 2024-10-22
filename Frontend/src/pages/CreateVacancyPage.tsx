import React, {useEffect, useState} from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {useAuth} from "../auth/AuthProvider.tsx";
import {getCompanies} from "../api/companyQueries.ts";
import {createVacancy} from "../api/vacancionsQueries.ts";
import Header from "../components/Header.tsx";
import toast from "react-hot-toast";

const CreateVacancy = () => {
    const {token} = useAuth();

    const [name, setName] = useState('');
    const [positionName, setPositionName] = useState('');
    const [incomeRub, setIncomeRub] = useState('');
    const [description, setDescription] = useState('');
    const [companyId, setCompanyId] = useState('');

    const { data: companies, isLoading: isCompaniesLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: () => getCompanies(token!),
    });

    const createVacancyMutation = useMutation({
        mutationFn: () =>
            createVacancy(token!, name, description, positionName, incomeRub, companyId),
        onSuccess: () => {
            toast.success('Вакансия создана');
            setName('')
            setPositionName('')
            setIncomeRub('')
            setDescription('')
            setCompanyId('')
        },
        onError: () => {
            toast.error('Не удалось создать вакансию');
        }
    });

    useEffect(() => {
        if (companies && companies.length > 0) {
            setCompanyId(companies[0].id);
        }
    }, [companies]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        createVacancyMutation.mutate()
    };

    if (isCompaniesLoading) {
        return <div>Загрузка...</div>;
    }

    return (
        <main>
            <Header title={"Создание вакансии"}/>
            <h2 className="text-lg font-bold mb-4 text-center mt-5">Создать новую вакансию</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border border-gray-300 rounded-md shadow-md">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Название вакансии
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="positionName">
                        Название должности
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="positionName"
                        type="text"
                        value={positionName}
                        onChange={(event) => setPositionName(event.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="incomeRub">
                        Зарплата в рублях
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="incomeRub"
                        type="text"
                        value={incomeRub}
                        onChange={(event) => setIncomeRub(event.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                        Описание вакансии
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="companyId">
                        Компания
                    </label>
                    <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="companyId"
                        value={companyId}
                        onChange={(event) => setCompanyId(event.target.value)}
                    >
                        {isCompaniesLoading ? (
                            <option>Loading...</option>
                        ) : (
                            companies!.map((company) => (
                                <option key={company.id} value={company.id}>
                                    {company.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                    disabled={createVacancyMutation.isPending}
                >
                    {createVacancyMutation.isPending ? 'Идет создание вакансии' : 'Создать вакансию'}
                </button>
            </form>
        </main>
    );
};

export default CreateVacancy;