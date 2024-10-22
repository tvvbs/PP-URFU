import { useState } from 'react';
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { getAllInterviews, updateInterviewState } from '../api/interviewsQueries';
import { useAuth } from '../auth/AuthProvider.tsx';
import {Interview, InterviewResult} from "../types/Interview.ts";
import toast from "react-hot-toast";
import Header from "../components/Header.tsx";

const AdminInterviewsPage = () => {
    return <main>
        <Header title="Интервью"/>
        <InterviewsList/>
    </main>
}

const InterviewsList = () => {
    const { token } = useAuth();
    const [selectedInterview, setSelectedInterview] = useState<Interview>();
    const [newState, setNewState] = useState<InterviewResult>();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const queryClient = useQueryClient();
    const { data: interviews, isLoading, error } = useQuery({
        queryFn: () => getAllInterviews({ token: token! }),
        queryKey: ['all-interviews'],
    });
    const mutation = useMutation({
        mutationFn: () => updateInterviewState({ interviewId: selectedInterview!.id, result: newState!, token: token! }),
        onSuccess: async () => {
            toast.success("Статус интервью успешно изменен")
            setIsModalOpen(false);
            await queryClient.invalidateQueries({
                queryKey: ['all-interviews']
            })
        },
        onError: () => {
            toast.error("Не удалось изменить статус интервью")
        }
    });

    const openModal = (interview: Interview) => {
        setSelectedInterview(interview);
        setIsModalOpen(true);
    };

    const handleSubmit = () => {
        if (selectedInterview && newState !== null) {
            mutation.mutate();
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Interviews</h1>
            <ul>
                {interviews
                    ?.filter((interview) => interview.result === undefined)
                    .map((interview) => (
                        <li key={interview.id} className="mb-2 flex justify-between items-center">
                            <div>{`${interview.student.name} - ${interview.vacancy.name}`}</div>
                            <button
                                onClick={() => openModal(interview)}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Change State
                            </button>
                        </li>
                    ))}
            </ul>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl mb-4">Select Interview State</h2>
                        <select
                            value={newState ?? ''}
                            onChange={(e) => setNewState(Number(e.target.value))}
                            className="mb-4 border rounded p-2 w-full"
                        >
                            <option value="" disabled>Select State</option>
                            <option value={0}>Passed</option>
                            <option value={1}>Failed</option>
                            <option value={2}>Canceled</option>
                            <option value={3}>Did Not Come</option>
                        </select>
                        <div className="flex justify-end">
                            <button
                                onClick={handleSubmit}
                                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Submit
                            </button>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminInterviewsPage;
