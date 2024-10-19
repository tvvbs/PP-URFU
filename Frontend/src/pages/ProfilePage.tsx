import Header from "../components/Header.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getStudentProfile, updateStudentProfile} from "../api/studentQueries.ts";
import {useNavigate} from "react-router-dom";
import {getCompanyProfile, updateCompanyProfile} from "../api/companyQueries.ts";

const ProfilePage = () => {
    const {role, token, id} = useAuth();

    return (
        <main>
            <Header title="Настройка профиля"/>
            {role === 'Student' ?
                <StudentProfileForm token={token!} id={id!}/>
                : <CompanyProfileForm token={token!} id={id!}/>}
        </main>
    );
};

type StudentProfileProps = {
    token: string,
    id: string
}

const StudentProfileForm = ({token, id}: StudentProfileProps) => {
    const {data, isLoading, error} = useQuery({
        queryKey: ['student', id], queryFn: () => getStudentProfile(id, token)
    });
    const mutation = useMutation({
        mutationFn: () => updateStudentProfile(token, id, login!, password!, name!, surname!, patronymic!)
    })
    const queryClient = useQueryClient()

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');

    useEffect(() => {
        if (data) {
            setLogin(data.login);
            setPassword(data.password);
            setName(data.name);
            setSurname(data.surname);
            setPatronymic(data.patronymic);
        }
    }, [data]);

    const navigate = useNavigate()

    if (isLoading || !data) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        await mutation.mutateAsync()

        if (mutation.isSuccess) {
            await queryClient.invalidateQueries({queryKey: ['student', id]})
            navigate(0)
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-lg font-bold mb-4">Редактировать профиль студента</h2>
            <div className="mb-4">
                <label
                    htmlFor="login"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Логин:
                </label>
                <input
                    type="text"
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="password"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Пароль:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="name"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Имя:
                </label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="surname"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Фамилия:
                </label>
                <input
                    type="text"
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label
                    htmlFor="lastname"
                    className="block text-gray-700 text-sm font-bold mb-2"
                >
                    Отчество:
                </label>
                <input
                    type="text"
                    id="lastname"
                    value={patronymic}
                    onChange={(e) => setPatronymic(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Сохранить изменения
            </button>
        </form>
    );
};

type CompanyProfileFormProps = {
    token: string,
    id: string
}

const CompanyProfileForm = ({ token, id }: CompanyProfileFormProps) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['company', id],
        queryFn: () => getCompanyProfile(token, id),
    });

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');

    useEffect(() => {
        if (data) {
            console.log(data.name)
            setLogin(data.login);
            setPassword(data.password);
            setCompanyName(data.name);
        }
    }, [data]);

    const mutation = useMutation({
        mutationFn: () => updateCompanyProfile(token, id, login!, password!, companyName!),
    });

    const queryClient = useQueryClient();

    const navigate = useNavigate();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await mutation.mutateAsync();

        if (mutation.isSuccess) {
            await queryClient.invalidateQueries({ queryKey: ['company', id] });
            navigate(0);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-md w-full mx-auto p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Редактировать профиль компании</h2>
            <div className="mb-4">
                <label htmlFor="login" className="block text-gray-700 text-sm font-bold mb-2">
                    Логин:
                </label>
                <input
                    type="text"
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                    Пароль:
                </label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="companyName" className="block text-gray-700 text-sm font-bold mb-2">
                    Название компании:
                </label>
                <input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
                Сохранить изменения
            </button>
        </form>
    );
};

export default ProfilePage;