import { Controller, type Control } from "react-hook-form";

type RupiahInputFieldProps = {
    label: string;
    placeholder?: string;
    icon?: React.ReactNode;
    control: Control<any>;
    name: string;
    error?: string;
};

export default function RupiahInputField({
    label,
    placeholder = "0",
    icon,
    control,
    name,
    error,
}: RupiahInputFieldProps) {
    return (
        <label className="form-control w-full">
            <div className="label pb-2">
                <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/70">
                    {label}
                </span>
            </div>
            <div
                className={`input input-bordered flex w-full items-center gap-2 ${error ? "input-error" : ""}`}
            >
                {icon && <span className="text-base-content/50 shrink-0">{icon}</span>}
                <span className="text-base-content/50 shrink-0">Rp</span>
                <Controller
                    control={control}
                    name={name}
                    render={({ field: { onChange, value, ...field } }) => (
                        <input
                            type="text"
                            className="w-full"
                            placeholder={placeholder}
                            inputMode="numeric"
                            {...field}
                            value={
                                value
                                    ? Number(value).toLocaleString("id-ID")
                                    : ""
                            }
                            onChange={(e) => {
                                const raw = e.target.value.replace(/\D/g, "");
                                onChange(raw ? Number(raw) : 0);
                            }}
                        />
                    )}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-error">{error}</p>
            )}
        </label>
    );
}
