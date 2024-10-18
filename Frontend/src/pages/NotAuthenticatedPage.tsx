import {Link} from 'react-router-dom'
import {LOGIN_ROUTE, SIGN_UP_ROUTE} from "../routes.tsx";

const NotAuthenticatedPage = () => {
    return (
        <main className='flex justify-center items-center h-dvh'>
            <nav className='flex gap-x-5'>
                <Link to={LOGIN_ROUTE}>Вход</Link>
                <Link to={SIGN_UP_ROUTE}>Регистрация</Link>
            </nav>
        </main>
    );
};

export default NotAuthenticatedPage;

