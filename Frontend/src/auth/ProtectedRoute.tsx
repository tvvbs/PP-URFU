import React from 'react';
import {useAuth} from "./AuthProvider.tsx";
import {Navigate} from 'react-router-dom'
import {NOT_AUTHENTICATED_ROUTE} from "../routes.tsx";
import {Role} from "../types/Role.ts";

type ProtectedRouteProps = React.PropsWithChildren & {
    allowed_roles?: Role[]
}

const ProtectedRoute = ({children, allowed_roles}: ProtectedRouteProps) => {
    const {token, role} = useAuth();

    if (token === undefined) {
        return <div>Loadingg...</div>
    }

    if (token === null || !role || (allowed_roles && !allowed_roles.includes(role))) {
        return <Navigate to={NOT_AUTHENTICATED_ROUTE}/>
    }

    return children
};

export default ProtectedRoute;