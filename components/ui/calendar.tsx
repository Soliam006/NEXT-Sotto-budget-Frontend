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
        <div className="w-full max-w-md p-4 bg-card rounded-lg shadow-md border border-border">
            {/* Cabecera con navegación */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={prevMonth}
                    className="p-2 rounded hover:bg-accent hover:text-accent-foreground"
                >
                    &lt;
                </button>
                <h2 className="text-lg font-semibold text-foreground">
                    {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <button
                    onClick={nextMonth}
                    className="p-2 rounded hover:bg-accent hover:text-accent-foreground"
                >
                    &gt;
                </button>
            </div>

            {/* Días de la semana */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                    <div key={day} className="text-center font-medium text-sm py-1 text-muted-foreground">
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
                    const isCurrentMonth = isSameMonth(day, currentMonth);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => !isDisabled && onSelect(day)}
                            className={`
                                h-10 rounded-full flex items-center justify-center
                                ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground opacity-50'}
                                ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                                ${
                                isDisabled
                                    ? 'text-muted-foreground opacity-50'
                                    : 'hover:bg-accent hover:text-accent-foreground cursor-pointer'
                            }
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