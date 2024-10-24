import {Role} from '../types/Role.ts'
import React, {useContext, useEffect, useState} from "react";
import {getUserInfo, login, saveUserInfo} from "./auth.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

type AuthContext = {
    token?: string | null,
    role?: Role | null
    id?: string | null
    handleLogin: (email: string, password: string, role: Role) => Promise<LoginResult>
    handleLogout: () => Promise<boolean>
}

const AuthContext = React.createContext<AuthContext | undefined>(undefined);

type AuthProviderProps = React.PropsWithChildren;

export default function AuthProvider({children}: AuthProviderProps) {
    const [token, setToken] = useState<string | null>();
    const [role, setRole] = useState<Role | null>();
    const [id, setId] = useState<string | null>();

    useEffect(() => {
        const {role, token, id} = getUserInfo()

        if (!role || !token || !id) {
            setToken(null)
            setRole(null)
            setId(null)
        } else {
            setToken(token)
            setRole(role)
            setId(id)
        }
    }, [])

    async function handleLogin(email: string, password: string, role: Role): Promise<LoginResult> {
        try {
            const response = await login(email, password, role);
            if (!response.error) {
                setToken(response.token)
                setRole(role)
                setId(response.id)
                saveUserInfo(role, response.token!, response.id!);

                return {
                    success: true
                }
            }

            return {
                success: false,
                error: response.error
            }
        } catch {
            setToken(null)
            setRole(null)
            setId(null)
            return {
                success: false,
                error: {
                    type: 'unknown',
                    title: 'Unknown error',
                    status: 500,
                    detail: 'Something went wrong'
                }
            }
        }
    }

    async function handleLogout() {
        setToken(null)
        setRole(null)
        return true
    }

    return <AuthContext.Provider value={{token, role, id, handleLogin, handleLogout}}>
        {children}
    </AuthContext.Provider>
}

export function useAuth(): AuthContext {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context
}

export type LoginResult = {
    success: boolean,
    error?: ApiErrorResponse
}