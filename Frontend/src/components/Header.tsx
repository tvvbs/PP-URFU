import {Link} from "react-router-dom";
import {CREATE_VACANCY_ROUTE, MAIN_PAGE_ROUTE, PROFILE_ROUTE, VACANCY_RESPOND_ROUTE} from "../routes.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";

type HeaderProps = {
    title?: string
}

const Header = ({title}: HeaderProps) => {
    const {handleLogout, role} = useAuth()

    return (
        <header className="bg-blue-400 p-4 md:p-6">
            {title && <h2 className="text-lg text-center text-white md:text-3xl lg:text-4xl mb-4">{title}</h2>}
            <nav className="flex justify-center">
                <ul className="flex justify-center space-x-2 md:space-x-4 lg:space-x-8 text-white md:flex-nowrap">
                    <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={MAIN_PAGE_ROUTE}>Вакансии</Link></li>
                    {(role === 'Student' || role === 'Admin') &&<li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={VACANCY_RESPOND_ROUTE}>Отклики на
                        вакансии</Link></li>}
                    {role === 'Student' &&
                        <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to="/calendar">Календарь
                            собеседований</Link></li>}
                    {(role === 'Student' || role === 'Company') && <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={PROFILE_ROUTE}>Личный кабинет</Link></li>}
                    {role === 'Admin' &&
                        <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={CREATE_VACANCY_ROUTE}>Создать
                            вакансию</Link></li>}
                    <li className="flex-grow text-xs md:text-base lg:text-lg">
                        <button className='bg-red-500 px-3 py-1 rounded-md text-xs md:text-base lg:text-lg'
                                onClick={async () => await handleLogout()}>
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