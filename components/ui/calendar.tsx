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
import { ca, es, enUS } from "date-fns/locale";

interface CustomCalendarProps {
    selected?: Date | null;
    onSelect?: (date: Date | null) => void;
    disabled?: (date: Date) => boolean;
    lang?: 'ca' | 'es' | 'en'; // Nuevo prop para el idioma
}

export function Calendar({
                             selected = null,
                             onSelect = () => {},
                             disabled = () => false,
                             lang = 'es' // Valor por defecto español
                         }: CustomCalendarProps) {

    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    // Seleccionar locale según el idioma
    const getLocale = () => {
        switch (lang) {
            case 'ca': return ca;
            case 'es': return es;
            case 'en': return enUS;
            default: return es;
        }
    };

    // Nombres de los días según el idioma
    const getDayNames = () => {
        switch (lang) {
            case 'ca': return ['Dg', 'Dl', 'Dt', 'Dc', 'Dj', 'Dv', 'Ds'];
            case 'es': return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
            case 'en': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            default: return ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
        }
    };

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
                    {format(currentMonth, 'MMMM yyyy', { locale: getLocale() })}
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
                {getDayNames().map(day => (
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