import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import {createBrowserRouter} from 'react-router-dom'
import MainPage from "./pages/MainPage.tsx";
import NotAuthenticatedPage from "./pages/NotAuthenticatedPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ProfilePage from "./pages/ProfilePage.tsx";
import CreateVacancyPage from "./pages/CreateVacancyPage.tsx";
import VacancyPage from "./pages/VacancyPage.tsx";
import VacancyRespondPage from "./pages/VacancyRespondPage.tsx";

export const MAIN_PAGE_ROUTE = "/"
export const NOT_AUTHENTICATED_ROUTE = '/not-authenticated'
export const LOGIN_ROUTE = '/login'
export const SIGN_UP_ROUTE = '/sign-up'
export const PROFILE_ROUTE = '/profile'
export const VACANCIES_ROUTE = '/vacancies'
export const CREATE_VACANCY_ROUTE = '/vacancies/create'
export const VACANCY_ROUTE = '/vacancies/:id'
export const VACANCY_RESPOND_ROUTE = '/vacancies-respond'

export const router = createBrowserRouter([
    {
        path: MAIN_PAGE_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Student', 'Company', 'Admin']}><MainPage/></ProtectedRoute>
    },
    {
        path: NOT_AUTHENTICATED_ROUTE,
        element: <NotAuthenticatedPage/>
    },
    {
        path: LOGIN_ROUTE,
        element: <LoginPage/>
    },
    {
        path: SIGN_UP_ROUTE,
        element: <SignUpPage/>
    },
    {
        path: PROFILE_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Student', 'Company', 'Admin']}><ProfilePage/></ProtectedRoute>
    },
    {
        path: CREATE_VACANCY_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Admin']}><CreateVacancyPage/></ProtectedRoute>
    },
    {
        path: VACANCY_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Student', 'Company', 'Admin']}><VacancyPage/></ProtectedRoute>
    },
    {
        path: VACANCY_RESPOND_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Student', 'Admin']}><VacancyRespondPage/></ProtectedRoute>
    }
])