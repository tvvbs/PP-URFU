import React, {useRef, useState} from "react";
import Header from "../components/Header.tsx";
import {useAuth} from "../auth/AuthProvider.tsx";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteVacancy, getVacancy, updateVacancy} from "../api/vacancionsQueries.ts";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import {Vacancy} from "../types/Vacancy.ts";
import {ApiErrorResponse} from "../types/ApiErrorResponse.ts";
import {MAIN_PAGE_ROUTE} from "../routes.tsx";
import toast, {Toaster} from "react-hot-toast";
import {sendResume} from "../api/vacancyResponsesQueries.ts";

const VacancyPage = () => {
    return (
        <main className="bg-gray-100 min-h-dvh">
            <Header/>
            <VacancyComponent/>
        </main>
    );
};

const VacancyComponent = () => {
    const [error, setError] = useState<string>();

    const {id: vacancyId} = useParams<{ id: string }>();
    const {token, role} = useAuth();

    const navigate = useNavigate();

    const {data: vacancy, error: vacancyError, isLoading: vacancyIsLoading} = useQuery({
        queryFn: () => getVacancy(token!, vacancyId!),
        queryKey: ['vacancy', vacancyId],
    });
    const deleteVacancyMutation = useMutation({
        mutationFn: () => deleteVacancy({token: token!, vacancyId: vacancyId!}),
        onSuccess: () => {
            toast.success("Вакансия успешно удалена");
            setTimeout(() => {
                navigate(MAIN_PAGE_ROUTE);
            }, 1500);
        },
        onError: (error: ApiErrorResponse) => {
            setError(error.detail)
        }
    })

    const [isEditing, setIsEditing] = useState(false);

    if (vacancyIsLoading) {
        return <div className="text-center text-lg md:text-xl lg:text-2xl">Загрузка...</div>;
    }

    if (vacancyError) {
        return <div
            className="text-center text-lg text-red-500 md:text-xl lg:text-2xl">Ошибка: {vacancyError.message}</div>;
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 md:p-8 lg:p-10 max-w-4xl mx-auto mt-6">
            {!isEditing ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm md:text-lg lg:text-xl font-semibold mb-2"
                                   htmlFor="name">
                                Название вакансии
                            </label>
                            <p className="text-gray-800 text-sm md:text-lg lg:text-xl" id="name">{vacancy!.name}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm md:text-lg lg:text-xl font-semibold mb-2"
                                   htmlFor="positionName">
                                Позиция
                            </label>
                            <p className="text-gray-800 text-sm md:text-lg lg:text-xl"
                               id="positionName">{vacancy!.positionName}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm md:text-lg lg:text-xl font-semibold mb-2"
                                   htmlFor="incomeRub">
                                Зарплата
                            </label>
                            <p className="text-gray-800 text-sm md:text-lg lg:text-xl"
                               id="incomeRub">{vacancy!.incomeRub} ₽</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm md:text-lg lg:text-xl font-semibold mb-2"
                                   htmlFor="description">
                                Описание вакансии
                            </label>
                            <p className="text-gray-800 text-sm md:text-lg lg:text-xl"
                               id="description">{vacancy!.description}</p>
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm md:text-lg lg:text-xl font-semibold mb-2"
                                   htmlFor="companyName">
                                Компания
                            </label>
                            <p className="text-gray-800 text-sm md:text-lg lg:text-xl" id="companyName">
                                {vacancy?.company?.name || 'Не указано'}
                            </p>
                        </div>
                        {error && <p className="text-red-500">{error}</p>}
                    </div>

                    {role === 'Admin' && (
                        <div className='flex gap-x-3'>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="mt-4 bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
                            >
                                Редактировать
                            </button>
                            <button
                                onClick={() => deleteVacancyMutation.mutate()}
                                disabled={deleteVacancyMutation.isPending}
                                className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
                            >
                                Удалить
                            </button>
                        </div>
                    )}
                    {role === 'Student' && (
                        <ResumeSender vacancyId={vacancy!.id}/>
                    )}
                </>
            ) : (
                <VacancyEditForm vacancy={vacancy!} setIsEditing={setIsEditing}/>
            )}
        </div>
    );
};

type VacancyEditFormProps = {
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    vacancy: Vacancy;
}

// Edit form component
const VacancyEditForm = ({vacancy, setIsEditing}: VacancyEditFormProps) => {
    const {token} = useAuth();
    const [formData, setFormData] = useState({
        name: vacancy.name,
        positionName: vacancy.positionName,
        incomeRub: vacancy.incomeRub,
        description: vacancy.description,
    });

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => {
            console.log("Mutation in mutation fn")
            return updateVacancy({
                token: token!,
                vacancyId: vacancy.id,
                vacancyName: formData.name,
                positionName: formData.positionName,
                incomeRub: formData.incomeRub,
                description: formData.description,
                companyId: vacancy.company?.id || ''
            })
        },
        onSuccess: async () => {
            toast.success("Вакансия успешно обновлена");
            setIsEditing(false)
            await queryClient.invalidateQueries({queryKey: ['vacancy', vacancy.id]})
        },
        onError: () => {
            toast.error("Не удалось обновить вакансию")
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
        console.log("Mutation in handle submit");
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Название вакансии</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="positionName">Позиция</label>
                    <input
                        type="text"
                        id="positionName"
                        name="positionName"
                        value={formData.positionName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="incomeRub">Зарплата</label>
                    <input
                        type="number"
                        id="incomeRub"
                        name="incomeRub"
                        value={formData.incomeRub}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="description">Описание</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        rows={4}
                        required
                    />
                </div>

            </div>

            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                >
                    Сохранить
                </button>
                <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-700"
                >
                    Отменить
                </button>
            </div>
        </form>
    );
};


interface ResumeSenderProps {
    vacancyId: string;
}

const ResumeSender = ({vacancyId}: ResumeSenderProps) => {
    const {token, id} = useAuth();
    const [message, setMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: () => sendResume({
            token: token!,
            studentId: id!,
            vacancyId: vacancyId,
            text: message,
            file: file!,
        })
        ,
        onSuccess: async () => {
            setMessage('');
            setFile(null);
            fileInputRef.current!.value = '';
            toast.success("Резюме успешно отправлено");
            await queryClient.invalidateQueries({queryKey: ['vacancy-responses', id]})
        },
        onError: () => {
            toast.error("Не удалось отправить резюме");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg shadow-md">
            <Toaster toastOptions={{duration: 2000}}/>
            <h2 className='text-xl font-bold'>Добавить резюме</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">
                        Сообщение
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded"
                        rows={4}
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="file">
                        Резюме
                    </label>
                    <input
                        type="file"
                        id="file"
                        name="file"
                        onChange={(e) => setFile(e.target.files![0])}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                        ref={fileInputRef}
                    />
                </div>
            </div>
            <div className="flex space-x-4">
                <button
                    type="submit"
                    className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
                >
                    Отправить
                </button>
            </div>
        </form>
    );
};

export default VacancyPage;