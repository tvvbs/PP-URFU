import {Link} from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-blue-400">
            <h2 className="text-2xl text-center text-white">Личный кабинет</h2>
            <nav>
                <ul className="flex justify-center space-x-10 text-white">
                    <li><Link to="/">Вакансии</Link></li>
                    <li><Link to="/responses">Отклики на вакансии</Link></li>
                    <li><Link to="/calendar">Календарь собеседований</Link></li>
                    <li><Link to="/profile">Настройка профиля</Link></li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;