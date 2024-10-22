import {useAuth} from "../auth/AuthProvider.tsx";
import Header from "../components/Header.tsx";
import {useQuery} from "@tanstack/react-query";
import {getVacancyResponsesForStudent} from "../api/vacancyResponsesQueries.ts";
import {Link} from "react-router-dom";
import {MAIN_PAGE_ROUTE} from "../routes.tsx";

const VacancyRespondPage = () => {
    const {role} = useAuth();

    return (
        <main>
            <Header title={"Отклики на вакансии"}/>
            {role === 'Student' && <StudentVacancyRespondComponent/>}
        </main>
    );
};

const StudentVacancyRespondComponent = () => {
    const {id, token} = useAuth();

    const query = useQuery({
        queryFn: () => getVacancyResponsesForStudent({studentId: id!, token: token!}),
        queryKey: ['vacancy-responses', id]
    })

    if (query.isLoading) {
        return <div>Загрузка</div>
    }

    if (query.error) {
        return <div>Не удалось загрузить отклки</div>
    }

    return (
        <>
            {query.data?.length === 0 ? (
                <div className="text-center mb-8">
                    <p className="text-gray-600 text-lg mb-4">У вас нет откликов</p>
                    <Link
                        to={MAIN_PAGE_ROUTE}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Найдите вакансию мечты прямо сейчас
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {query?.data?.map((i) => (
                        <li key={i.id} className="py-4 flex justify-between">
                            <div>
                                <p className="text-lg font-bold">{i.vacancy.name}</p>
                                <p className="text-gray-600">{i.Status}</p>
                            </div>
                            <div className="text-right">
                                {i.Status === 'Pending' && (
                                    <span className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded">
                            Ожидает ответа
                        </span>
                                )}
                                {i.Status === 'InvitedToInterview' && (
                                    <span className="bg-green-100 text-green-800 py-1 px-2 rounded">
                            Приглашен на интервью
                        </span>
                                )}
                                {i.Status === 'Declined' && (
                                    <span className="bg-red-100 text-red-800 py-1 px-2 rounded">
                            Отклонено
                        </span>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </>
    )
}

export default VacancyRespondPage;