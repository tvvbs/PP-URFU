import {Link} from "react-router-dom";
import {
    AdMIN_INTERVIEWS_ROUTE,
    CREATE_VACANCY_ROUTE,
    INTERVIEW_CALENDAR_ROUTE,
    MAIN_PAGE_ROUTE,
    PROFILE_ROUTE,
    VACANCY_RESPOND_ROUTE
} from "../routes.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {Notification, NotificationType} from "../types/Notification.ts";
import {getAllNotificationsForStudent, markRead} from "../api/notificationsQueries.ts";
import toast from "react-hot-toast";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";

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
                    <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={MAIN_PAGE_ROUTE}>Вакансии</Link>
                    </li>
                    {(role === 'Student' || role === 'Admin') &&
                        <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={VACANCY_RESPOND_ROUTE}>Отклики
                            на
                            вакансии</Link></li>}
                    {role === 'Student' &&
                        <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={INTERVIEW_CALENDAR_ROUTE}>Календарь
                            собеседований</Link></li>}
                    {(role === 'Student' || role === 'Company') && (
                        <li className="flex-grow text-xs md:text-base lg:text-lg flex gap-x-1">
                            <Link to={PROFILE_ROUTE}>Личный кабинет</Link>
                            {role === 'Student' && <NotificationCounter/>}
                        </li>)}
                    {role === 'Admin' &&
                        <li className="flex-grow text-xs md:text-base lg:text-lg"><Link to={CREATE_VACANCY_ROUTE}>Создать
                            вакансию</Link></li>}
                    {role === 'Admin' && <li className="flex-grow text-xs md:text-base lg:text-lg"><Link
                        to={AdMIN_INTERVIEWS_ROUTE}>Интервью</Link></li>}
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

const NotificationCounter = () => {
    const {token, id} = useAuth();

    const [showPopup, setShowPopup] = useState(false);
    const [expandedNotifId, setExpandedNotifId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const {data, isLoading, isError, error} = useQuery({
        queryFn: () => getAllNotificationsForStudent({token: token!}),
        queryKey: ['notifications', id],
    });

    const mutation = useMutation({
        mutationFn: (id: string) => markRead({id, token: token!}),
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['notifications', id]});
        },
        onError: (error: ApiErrorResponse) => {
            toast.error(error.detail);
        }
    });

    const unreadCount = data?.filter((n: Notification) => !n.isRead).length || 0;

    return (
        <div className="relative">
            <div onClick={() => setShowPopup(!showPopup)}
                 className="relative cursor-pointer hover:scale-110 transition-transform duration-200">
                {isLoading ? (
                    <div
                        className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white animate-spin">...</div>
                ) : isError ? (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white"
                         title={error.message}>!</div>
                ) : (
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white">
                        {unreadCount}
                    </div>
                )}
            </div>

            {showPopup && (
                <div
                    className="absolute top-10 right-0 w-72 bg-white shadow-lg rounded-lg p-4 max-h-48 overflow-y-auto border border-gray-300">
                    {data?.length ? (
                        data.map((n: Notification) => (
                            <div key={n.id}
                                 className="p-2 border-b border-gray-200 flex justify-between items-center hover:bg-gray-100 transition duration-200">
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-semibold text-black">{n.type === NotificationType.NewVacancy ? "Новая вакансия" : "Сообщение"}</p>

                                    <p
                                        className={`text-xs text-gray-500 ${expandedNotifId === n.id ? '' : 'truncate'}`}
                                        onClick={() => setExpandedNotifId(expandedNotifId === n.id ? null : n.id)}
                                    >
                                        {n.jsonData}
                                    </p>
                                </div>
                                {!n.isRead && (
                                    <button
                                        className="bg-green-500 text-white px-3 py-1 text-xs rounded hover:bg-green-600 transition duration-200 flex-shrink-0"
                                        onClick={() => mutation.mutate(n.id)}
                                    >
                                        Пометить как прочитанное
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500">No notifications.</p>
                    )}
                </div>
            )}
        </div>
    );
};


export default Header;