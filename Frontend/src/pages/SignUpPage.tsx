import {useState} from 'react';
import {Link} from 'react-router-dom'
import {LOGIN_ROUTE} from "../routes.tsx";
import {register_company, register_student} from "../auth/auth.ts";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const RegistrationPage = () => {
    const [isStudent, setIsStudent] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [patronymic, setPatronymic] = useState('');
    const [companyName, setCompanyName] = useState('');

    const navigate = useNavigate()

    const handle_submit = async () => {
        if (isStudent) {
            const res = await register_student(email, password, passwordConfirmation, name, surname, patronymic);
            if (res.success) {
                toast.success("Аккаунт успешно создан")
                navigate(LOGIN_ROUTE)
            } else {
                toast.error(res.error?.detail || 'Не удалось создать аккаунт')
            }
        } else {
            const res = await register_company(email, password, passwordConfirmation, companyName)
            if (res.success) {
                toast.success("Аккаунт успешно создан")
                navigate(LOGIN_ROUTE)
            } else {
                toast.error(res.error?.detail || 'Не удалось создать аккаунт')
            }
        }
    }

    return (
        <main className='flex h-dvh justify-center items-center p-10'>
            <div className="md: max-w-2/3 lg: max-w-[600px] mx-auto w-full p-6 bg-white rounded shadow-md">
                <h1 className="text-3xl font-bold mb-4">Форма регистрации</h1>
                <form className="flex flex-col space-y-4" onSubmit={async (e) => {
                    e.preventDefault()
                    await handle_submit()
                }}>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={isStudent}
                            onChange={() => setIsStudent(!isStudent)}
                            className="h-4 w-4"
                        />
                        <label className="text-lg">Я студент</label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={!isStudent}
                            onChange={() => setIsStudent(!isStudent)}
                            className="h-4 w-4"
                        />
                        <label className="text-lg">Я компания</label>
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-lg">Почта</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                            required={true}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-lg">Пароль:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                            required={true}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <label className="text-lg">Повторите пароль:</label>
                        <input
                            type="password"
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            className="p-2 border border-gray-300 rounded"
                            required={true}
                        />
                    </div>
                    {isStudent ? (
                        <div className="flex flex-col space-y-4">
                            <div className="flex flex-col space-y-2">
                                <label className="text-lg">Имя:</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-lg">Фамилия:</label>
                                <input
                                    type="text"
                                    value={surname}
                                    onChange={(e) => setSurname(e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                    required={true}
                                />
                            </div>
                            <div className="flex flex-col space-y-2">
                                <label className="text-lg">Отчество:</label>
                                <input
                                    type="text"
                                    value={patronymic}
                                    onChange={(e) => setPatronymic(e.target.value)}
                                    className="p-2 border border-gray-300 rounded"
                                    required={true}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col space-y-2">
                            <label className="text-lg">Имя компании:</label>
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                                required={true}
                            />
                        </div>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded self-center"
                    >
                        Зарегистироваться
                    </button>
                    <Link to={LOGIN_ROUTE} className='mt-5 inline-block self-center'>Уже есть аккаунт? Войти</Link>
                </form>
            </div>
        </main>

    );
};

export default RegistrationPage;