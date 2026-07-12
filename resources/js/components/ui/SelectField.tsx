import { useRef, useState } from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";
import Select from "react-select";
import { reactSelectStyles } from "./selectStyles";

type SelectFieldProps<T extends FieldValues> = {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    control: Control<T>;
    name: Path<T>;
    options: { value: string | number; label: string }[];
    error?: string;
};

export default function SelectField<T extends FieldValues>({
    label,
    placeholder,
    icon,
    control,
    name,
    options,
    error,
}: SelectFieldProps<T>) {
    const wrapRef = useRef<HTMLLabelElement>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    return (
        <label ref={wrapRef} className="form-control w-full">
            <div className="label pb-2">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                    {label}
                </span>
            </div>
            <div className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 ${error ? "border-error" : "border-base-300"}`}>
                <span className="text-base-content/50 shrink-0">{icon}</span>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <Select
                            className="w-full"
                            classNamePrefix="react-select"
                            placeholder={placeholder}
                            options={options}
                            isClearable
                            value={options.find((o) => String(o.value) === String(field.value)) ?? null}
                            onChange={(option) => field.onChange(option?.value ?? "")}
                            onBlur={field.onBlur}
                            onMenuOpen={() => {
                                const dialog = wrapRef.current?.closest("dialog");
                                setPortalTarget((dialog as HTMLElement) ?? document.body);
                            }}
                            menuPortalTarget={portalTarget ?? undefined}
                            styles={reactSelectStyles}
                        />
                    )}
                />
            </div>
            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </label>
    );
}
