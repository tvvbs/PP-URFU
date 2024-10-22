import React, { useState } from 'react';
import { Role } from "../types/Role.ts";
import { useAuth } from "../auth/AuthProvider.tsx";
import { useNavigate } from 'react-router'
import {MAIN_PAGE_ROUTE, SIGN_UP_ROUTE} from "../routes.tsx";
import {Link} from 'react-router-dom'
import toast from "react-hot-toast";


const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [role, setRole] = useState<Role>('Student')

    const navigate = useNavigate()

    const { handleLogin } = useAuth()

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        try {
            event.preventDefault()
            const loginResult = await handleLogin(email, password, role)
            if (loginResult.success) {
                toast.success("Вы успешно вошли")
                navigate(MAIN_PAGE_ROUTE)
            } else {
                toast.error(loginResult.error?.detail || 'Не удалось войти в аккаунт')
            }

        } catch {
            toast.error("Не удалось войти в аккаунт")
        }
    }

    return (
        <main className="h-screen flex justify-center items-center bg-gray-100">
            <form onSubmit={async (e) => {
                e.preventDefault()
                await handleSubmit(e)
            }}
                  className="bg-white rounded-md shadow-md p-6 md:max-w-sm
                  lg:max-w-lg xl:max-w-600px sm:w-5/6 sm:mx-auto flex flex-col">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Форма входа</h2>
                <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Введите почту" className="block w-full p-2 mb-4 border border-gray-300 rounded-md" />
                <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Введите пароль" className="block w-full p-2 mb-4 border border-gray-300 rounded-md" />
                <select value={role} onChange={(event) => setRole(event.target.value as Role)} className="block w-full p-2 mb-4 border border-gray-300 rounded-md">
                    <option value={'Student' as Role}>Студент</option>
                    <option value={'Company' as Role}>Предприятие</option>
                    <option value={'Admin' as Role}>Админ</option>
                </select>
                <button type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-md self-center">Войти</button>
                <Link to={SIGN_UP_ROUTE} className='self-center inline-block mt-3'>Нет аккаунта? Зарегистрируйтесь</Link>
            </form>
        </main>
    );
};

export default LoginPage;