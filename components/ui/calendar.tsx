"use client"
import { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay
} from "date-fns";

interface CustomCalendarProps {
    selected?: Date | null;
    onSelect?: (date: Date | null) => void;
    disabled?: (date: Date) => boolean;
}

export function Calendar({
                                           selected = null,
                                           onSelect = () => {},
                                           disabled = () => false
                                       }: CustomCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Generar días del mes
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Navegación entre meses
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    return (
        <div className="w-full max-w-md p-4 bg-white rounded-lg shadow-md">
            {/* Cabecera con navegación */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={prevMonth} className="p-2 rounded hover:bg-gray-100">
                    &lt;
                </button>
                <h2 className="text-lg font-semibold">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button onClick={nextMonth} className="p-2 rounded hover:bg-gray-100">
                    &gt;
                </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-medium text-sm py-1">
                        {day}
                    </div>
                ))}
            </div>

            {/* Días del mes */}
            <div className="grid grid-cols-7 gap-1">
                {/* Espacios vacíos para alinear los días */}
                {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                    <div key={`empty-${index}`} className="h-10"></div>
                ))}

                {/* Días renderizados */}
                {daysInMonth.map(day => {
                    const isSelected = selected && isSameDay(day, selected);
                    const isDisabled = disabled(day);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => !isDisabled && onSelect(day)}
                            className={`
                h-10 rounded-full flex items-center justify-center
                ${isSameMonth(day, currentMonth) ? '' : 'text-gray-300'}
                ${isSelected ? 'bg-blue-500 text-white' : ''}
                ${isDisabled ? 'text-gray-300' : 'hover:bg-gray-100 cursor-pointer text-gray-800'}
              `}
                        >
                            {format(day, 'd')}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}