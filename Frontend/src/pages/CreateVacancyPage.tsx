import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchCompanies } from '../api/companies';
import {Vacancy} from "../types/Vacancy.ts";
import {useAuth} from "../auth/AuthProvider.tsx"; // assume this is your API endpoint

const CreateVacancy = () => {
    const {token} = useAuth();

    const [name, setName] = useState('');
    const [positionName, setPositionName] = useState('');
    const [incomeRub, setIncomeRub] = useState('');
    const [description, setDescription] = useState('');
    const [companyId, setCompanyId] = useState('');

    const { data: companies, isLoading: isCompaniesLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: () => fetchCompanies(token),
    });

    const { mutateAsync, isLoading: isCreating } = useMutation(
        async (vacancy: Vacancy) => {
            // assume this is your API endpoint to create a new vacancy
            const response = await fetch('/api/vacancies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(vacancy),
            });
            return response.json();
        }
    );

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const vacancy: Vacancy = {
            name,
            positionName,
            incomeRub,
            description,
            companyId,
        };
        await mutateAsync(vacancy);
    };

    return (
        <div className="max-w-md mx-auto p-4">
            <h2 className="text-lg font-bold mb-4">Create New Vacancy</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
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
                        Position Name
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
                        Income Rub
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
                        Description
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
                        Company
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
                            companies.map((company) => (
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
                    disabled={isCreating}
                >
                    {isCreating ? 'Creating...' : 'Create Vacancy'}
                </button>
            </form>
        </div>
    );
};

export default CreateVacancy;