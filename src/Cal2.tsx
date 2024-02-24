'use client';
import clsx from 'clsx';
import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


export default function Cal2() {
    const [selectedDay, setSelectedDay] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const handlePreviousMonth = () => {
        setCurrentMonth(prevMonth);
    }

    const handleNextMonth = () => {
        setCurrentMonth(nextMonth);
    }

    const renderDaysOfWeek = daysOfWeek.map((day, index) => (
        <div key={index} className="w-1/7 p-4 border border-gray-400">{day}</div>
    ));
    
    const handleSelectedDay = (date: Date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setSelectedDay(formattedDate);
    }
    // render adjacent days from previous and next month
    const renderDays = () => {
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
                        className={`w-1/7 bg-white p-4 border-none rounded border-gray-400 cursor-pointer hover:bg-gray-100 ${selectedDay === dayKey ? 'bg-blue-500 text-white' : ''}`}
                        onClick={() => handleSelectedDay(new Date(day))}
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
    return (
        <div>
            <h2 className="text-base font-semibold leading-6 text-gray-900">
                Upcoming meetings
            </h2>
            <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
                <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9">
                    <div className="flex items-center text-gray-900">
                        <button
                            type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            onClick={handlePreviousMonth}
                        >
                            <span className="sr-only">Previous month</span>
                            <FiChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                        <div className="flex-auto text-sm font-semibold">
                            {`${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`}
                        </div>
                        <button
                            type="button"
                            className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            onClick={handleNextMonth}
                        >
                            <span className="sr-only">Next month</span>
                            <FiChevronRight className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
                        {renderDaysOfWeek}
                    </div>
                    <div>
                        {renderDays()}
                    </div>
                </div>
            </div>
        </div>
    );
}
