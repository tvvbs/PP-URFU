import {Link} from "react-router-dom";
import {CREATE_VACANCY_ROUTE, PROFILE_ROUTE} from "../routes.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";

type HeaderProps = {
    title: string
}

const Header = ({title}: HeaderProps) => {
    const {handleLogout, role} = useAuth()

    return (
        <header className="bg-blue-400">
            <h2 className="text-2xl text-center text-white">{title}</h2>
            <nav>
                <ul className="flex justify-center space-x-10 text-white">
                    <li><Link to="/">Вакансии</Link></li>
                    <li><Link to="/responses">Отклики на вакансии</Link></li>
                    {role === 'Student' && <li><Link to="/calendar">Календарь собеседований</Link></li>}
                    <li><Link to={PROFILE_ROUTE}>Настройка профиля</Link></li>
                    {role === 'Admin' && <li><Link to={CREATE_VACANCY_ROUTE}>Создать вакансию</Link></li>}
                    <li>
                        <button className='bg-red-500 px-3 py-1 rounded-md' onClick={async () => await handleLogout()}>
                            Выйти из системы
                        </button>
                    </li>
                </ul>
            </nav>

        </header>
    )
        ;
};

export default Header;