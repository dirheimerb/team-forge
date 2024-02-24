import RenderDays from "./RenderDays";
import { useState } from "react";

export default function FullCal() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState({
        day: '', 
        month: '',
        year: ''
    });

    const handleSelectedDay = (date: Date) => {
        setSelectedDay({
            ...selectedDay,
            day: date.getDate().toString(),
            month: (date.getMonth() + 1).toString(),
            year: date.getFullYear().toString()
        });
    }

    return (
        <RenderDays currentMonth={currentMonth} selectedDay={selectedDay} handleSelectedDay={handleSelectedDay} />
    )
}