import Header from "../components/Header.tsx";
import { useQuery } from "@tanstack/react-query";
import { getAllInterviewsForStudent } from "../api/interviewsQueries.ts";
import { useAuth } from "../auth/AuthProvider.tsx";
import Calendar from "react-calendar";

const InterviewCalendarPage = () => {
    return (
        <main>
            <Header title={"Календарь собеседований"} />
            <InterviewCalendar />
        </main>
    );
};

const InterviewCalendar = () => {
    const { token, id } = useAuth();

    const { data: interviews, isLoading, error } = useQuery({
        queryFn: () =>
            getAllInterviewsForStudent({
                token: token!,
                studentId: id!,
            }),
        queryKey: ["interviews", id],
    });

    if (isLoading) {
        return <div>Загрузка...</div>;
    }

    if (error) {
        return (
            <div>Произошла ошибка при загрузке собеседований</div>
        );
    }

    console.log(interviews);

    const interviewDates = interviews?.map((interview) => new Date(interview.dateTime)) || [];
    console.log(interviewDates)

    return (
        <div className="p-6 mx-auto">
            <h1 className="text-3xl font-semibold mb-6">Календарь собеседований</h1>
            <Calendar
                locale="ru"
                tileContent={({ date, view }) => {
                    if (view === "month") {
                        const interview = interviewDates.find((d) =>
                            d.toDateString() === date.toDateString()
                        );
                        if (interview) {
                            return (
                                <div className="text-sm font-bold text-red-600">
                                    Собеседование в {interview.toLocaleTimeString("ru-RU", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true, // Use 12-hour format
                                }).replace("AM", "").replace("PM", "")} {/* Remove AM/PM if you want */}
                                </div>
                            );
                        }
                    }
                    return null;
                }}
            />


        </div>
    );
};

export default InterviewCalendarPage;