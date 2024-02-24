import clsx from "clsx";

export interface RenderDaysProps {
    currentMonth: Date;
    selectedDay: {
        day: string;
        month: string;
        year: string;
    };
    handleSelectedDay: (date: Date) => void;
}

export default function RenderDays({ currentMonth, selectedDay, handleSelectedDay }: RenderDaysProps) {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart.setDate(monthStart.getDate() - monthStart.getDay()));
    const endDate = new Date(monthEnd.setDate(monthEnd.getDate() + (6 - monthEnd.getDay())));

    const rows = [];

    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            const dayKey = day.toISOString().split('T')[0];
            days.push(
                <div 
                    key={day.toString()} 
                    className={clsx(
                        currentMonth.getMonth() === day.getMonth() ? 'hover:bg-gray-100' : 'text-gray-300 cursor-none',
                        `w-1/7 bg-white p-4 border-none rounded cursor-pointer ${selectedDay.day === dayKey ? 'bg-blue-500 text-white' : ''}`)}
                    onClick={() => handleSelectedDay(new Date(day))}
                    data-id={dayKey}
                >
                    {day.getDate()}
                </div>
            );
            day = new Date(day.setDate(day.getDate() + 1));
        }
        rows.push(
            <div key={day.toString()} className={clsx("grid grid-cols-7 text-xs leading-6 text-gray-500")}>
                {days}
            </div>
        );
        days = [];
    }
    return rows;
}