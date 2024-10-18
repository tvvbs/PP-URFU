import ProtectedRoute from "./auth/ProtectedRoute.tsx";
import {createBrowserRouter} from 'react-router-dom'
import MainPage from "./pages/MainPage.tsx";
import NotAuthenticatedPage from "./pages/NotAuthenticatedPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";

export const MAIN_PAGE_ROUTE = "/"
export const NOT_AUTHENTICATED_ROUTE = '/not-authenticated'
export const LOGIN_ROUTE = '/login'
export const SIGN_UP_ROUTE = '/sign-up'

export const router = createBrowserRouter([
    {
        path: MAIN_PAGE_ROUTE,
        element: <ProtectedRoute
            allowed_roles={['Student', 'Enterprise', 'Admin']}><MainPage/></ProtectedRoute>
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
    }
])