import {useAuth} from "../auth/AuthProvider.tsx";
import Header from "../components/Header.tsx";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
    editVacancyResponse,
    getAllVacancyResponses,
    getVacancyResponsesForStudent
} from "../api/vacancyResponsesQueries.ts";
import {Link} from "react-router-dom";
import {MAIN_PAGE_ROUTE} from "../routes.tsx";
import {VacancyResponse, VacancyResponseStatus} from "../types/VacancyResponse.ts";
import {useState} from "react";
import toast from "react-hot-toast";
import {File} from "../types/File.ts";

const VacancyRespondPage = () => {
    const {role} = useAuth();

    return (
        <main>
            <Header title={"Отклики на вакансии"}/>
            {role === 'Student' && <StudentVacancyRespondComponent/>}
            {role === 'Admin' && <AdminVacancyRespondComponent/>}
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
                <div className="text-center mb-8 md:mb-12 lg:mb-16">
                    <p className="text-gray-600 text-lg mb-4 md:mb-6 lg:mb-8">У вас нет откликов</p>
                    <Link
                        to={MAIN_PAGE_ROUTE}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded md:py-3 md:px-6 lg:py-4 lg:px-8"
                    >
                        Найдите вакансию мечты прямо сейчас
                    </Link>
                </div>
            ) : (
                <ul className="divide-y divide-gray-200">
                    {query?.data?.map((i) => (
                        <li key={i.id} className="py-4 flex justify-between md:py-6 lg:py-8">
                            <div>
                                <p className="text-lg font-bold md:text-xl lg:text-2xl">Вакансия: {i.vacancy.name}</p>
                            </div>
                            <div className="text-right">
                                {i.status === VacancyResponseStatus.Pending && (
                                    <span
                                        className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded md:py-2 md:px-4 lg:py-3 lg:px-6">
                                    В процессе
                                </span>
                                )}
                                {i.status === VacancyResponseStatus.InvitedToInterview && (
                                    <span
                                        className="bg-green-100 text-green-800 py-1 px-2 rounded md:py-2 md:px-4 lg:py-3 lg:px-6">
                                    Приглашен на интервью
                                </span>
                                )}
                                {i.status === VacancyResponseStatus.Declined && (
                                    <span
                                        className="bg-red-100 text-red-800 py-1 px-2 rounded md:py-2 md:px-4 lg:py-3 lg:px-6">
                                    Отклонен
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

const AdminVacancyRespondComponent = () => {
    const handleDownload = (file: File) => {
        try {
            const url = URL.createObjectURL(new Blob([file.data], { type: 'application/octet-stream' }));

            // Create a link element and trigger the download
            const link = document.createElement('a');
            link.href = url;
            link.download = file.name;
            document.body.appendChild(link);
            link.click(); // Trigger the download

            // Clean up the URL object and remove the link element
            URL.revokeObjectURL(url);
            document.body.removeChild(link); // Remove link element
        } catch (error) {
            console.error('Error while downloading resume:', error);
        }
    };


    const {token} = useAuth();

    const queryClient = useQueryClient();
    const query = useQuery({
        queryFn: () => getAllVacancyResponses({token: token!}),
        queryKey: ['vacancy-responses-admin']
    });

    const changeStatusMutation = useMutation({
        mutationFn: () => editVacancyResponse({
            token: token!,
            vacancyResponseId: selectedResponse!.id,
            newStatus,
            interviewTime: interviewTime ? new Date(interviewTime) : undefined
        }),
        onSuccess: async () => {
            toast.success("Статус отклика успешно изменен");
            setShowPopup(false)
            await queryClient.invalidateQueries({
                queryKey: ['vacancy-responses-admin']
            })
        },
        onError: () => {
            toast.error("Не удалось изменить статус отклика");
        }
    })

    const [selectedResponse, setSelectedResponse] = useState<VacancyResponse>();
    const [showPopup, setShowPopup] = useState(false);
    const [newStatus, setNewStatus] = useState(VacancyResponseStatus.Declined);
    const [interviewTime, setInterviewTime] = useState('');

    const handleEditClick = (response: VacancyResponse) => {
        setSelectedResponse(response);
        setShowPopup(true);
    };

    const handleStatusChange = () => {
        if (selectedResponse) {
            changeStatusMutation.mutate()
        }
    };

    if (query.isLoading) {
        return <div>Загрузка</div>;
    }

    if (query.error) {
        return <div>Не удалось загрузить отклики</div>;
    }

    return (
        <div>
            <ul className="divide-y divide-gray-200">
                {query.data?.map((i) => {
                    console.log(i.resume);
                    return (<li key={i.id} className="py-4 flex justify-between md:py-6 lg:py-8">
                        <div>
                            <p className="text-lg font-bold md:text-xl lg:text-2xl">Вакансия: {i.vacancy.name}</p>
                            <p>Студент: {i.student.name} {i.student.surname}</p>
                            <button onClick={() => handleDownload(i.resume)}>Скачать резюме кандидата</button>
                        </div>
                        <div className="text-right">
                            {i.status === VacancyResponseStatus.Pending ? (
                                <>
                                    <span
                                        className="bg-yellow-100 text-yellow-800 py-1 px-2 rounded md:py-2 md:px-4 lg:py-3 lg:px-6">
                                        В процессе
                                    </span>
                                    <button
                                        onClick={() => handleEditClick(i)}
                                        className="ml-4 bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
                                    >
                                        Изменить статус
                                    </button>
                                </>
                            ) : (
                                <span
                                    className={`py-1 px-2 rounded md:py-2 md:px-4 lg:py-3 lg:px-6 ${
                                        i.status === VacancyResponseStatus.InvitedToInterview
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                    }`}
                                >
                                    {i.status === VacancyResponseStatus.InvitedToInterview ? "Приглашен на интервью" : "Отклонен"}
                                </span>
                            )}
                        </div>
                    </li>);
                })}
            </ul>

            {showPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Изменить статус отклика</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Выберите новый статус:</label>
                            <select
                                value={newStatus}
                                onChange={(e) =>
                                    setNewStatus(Number(e.target.value) as VacancyResponseStatus)}
                                className="w-full p-2 border border-gray-300 rounded"
                            >
                                <option value={VacancyResponseStatus.InvitedToInterview.toString()}>Приглашен на
                                    интервью
                                </option>
                                <option value={VacancyResponseStatus.Declined.toString()}>Отклонен</option>
                            </select>
                        </div>
                        {newStatus === VacancyResponseStatus.InvitedToInterview && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Введите дату и время интервью:</label>
                                <input
                                    type="datetime-local"
                                    value={interviewTime}
                                    onChange={(e) => setInterviewTime(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                        )}
                        <div className="flex justify-end">
                            <button
                                onClick={handleStatusChange}
                                className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded mr-2"
                            >
                                Сохранить
                            </button>
                            <button
                                onClick={() => setShowPopup(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default VacancyRespondPage;