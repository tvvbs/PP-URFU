import Header from "../components/Header.tsx";
import {useQuery} from "@tanstack/react-query";
import {getAllInterviewsForStudent} from "../api/interviewsQueries.ts";
import {useAuth} from "../auth/AuthProvider.tsx";
import Calendar from "react-calendar";

const InterviewCalendarPage = () => {
    return (
        <main>
            <Header title={"Календарь собеседований"}/>
            <InterviewCalendar/>
        </main>
    );
};

const InterviewCalendar = () => {
    const {token, id} = useAuth();

    const {data: interviews, isLoading, error} = useQuery({
        queryFn: () => getAllInterviewsForStudent({
            token: token!,
            studentId: id!
        }),
        queryKey: ['interviews', id]
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return <div>Произошла ошибка при загрузке собеседований</div>;
    }

    console.log(interviews);

    const interviewDates = interviews?.map((interview) => new Date(interview.dateTime)) || [];

    return (
        <div className="p-6 mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Календарь собеседований</h1>
            <Calendar
                locale="ru"
                tileContent={({date, view}) =>
                    view === 'month' && interviewDates.some(d => d.toDateString() === date.toDateString()) ? (
                        <div className="text-sm font-bold text-red-600">Собеседование в {
                            date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false})}</div>
                    ) : null
                }
                className="w-full border rounded-lg shadow-md" // Custom styles for calendar
            />
        </div>
    );
};


export default InterviewCalendarPage;