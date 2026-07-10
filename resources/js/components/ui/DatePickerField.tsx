import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getYear, getMonth } from "date-fns";

type DatePickerFieldProps<T extends FieldValues> = {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    control: Control<T>;
    name: Path<T>;
    error?: string;
    showMonthYearPicker?: boolean;
    showYearPicker?: boolean;
    yearDropdownItemNumber?: number;
    minDate?: Date;
    maxDate?: Date;
};

const years = Array.from({ length: getYear(new Date()) - 1949 + 1 }, (_, i) => 1950 + i);

const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

function CustomHeader({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
}: {
    date: Date;
    changeYear: (year: number) => void;
    changeMonth: (month: number) => void;
    decreaseMonth: () => void;
    increaseMonth: () => void;
    prevMonthButtonDisabled: boolean;
    nextMonthButtonDisabled: boolean;
}) {
    return (
        <div className="flex items-center gap-1 px-2 py-2">
            <button
                type="button"
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="btn btn-ghost btn-xs btn-square"
            >
                <ChevronLeft size={16} />
            </button>
            <select
                className="select select-bordered select-xs w-28"
                value={getYear(date)}
                onClick={(e) => e.stopPropagation()}
                onChange={({ target: { value } }) => changeYear(Number(value))}
            >
                {years.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <select
                className="select select-bordered select-xs w-28"
                value={getMonth(date)}
                onClick={(e) => e.stopPropagation()}
                onChange={({ target: { value } }) => changeMonth(Number(value))}
            >
                {months.map((option, index) => (
                    <option key={option} value={index}>
                        {option}
                    </option>
                ))}
            </select>
            <button
                type="button"
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="btn btn-ghost btn-xs btn-square"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
}

export default function DatePickerField<T extends FieldValues>({
    label,
    placeholder,
    icon,
    control,
    name,
    error,
    showMonthYearPicker,
    showYearPicker,
    yearDropdownItemNumber,
    minDate,
    maxDate,
}: DatePickerFieldProps<T>) {
    return (
        <label className="form-control w-full">
            <div className="label pb-2">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                    {label}
                </span>
            </div>
            <div
                className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${error ? "border-error" : "border-base-300"}`}
            >
                <span className="text-base-content/50 shrink-0">{icon}</span>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <DatePicker
                            className="w-full bg-transparent outline-none"
                            placeholderText={placeholder}
                            locale={id}
                            dateFormat={showMonthYearPicker ? "MM/yyyy" : showYearPicker ? "yyyy" : "dd/MM/yyyy"}
                            selected={field.value}
                            onChange={(date) => field.onChange(date)}
                            onBlur={field.onBlur}
                            showMonthYearPicker={showMonthYearPicker}
                            showYearPicker={showYearPicker}
                            yearDropdownItemNumber={yearDropdownItemNumber}
                            minDate={minDate}
                            maxDate={maxDate}
                            renderCustomHeader={(props) => <CustomHeader {...props} />}
                        />
                    )}
                />
            </div>
            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </label>
    );
}
