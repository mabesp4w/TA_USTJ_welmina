import { type UseFormRegisterReturn } from "react-hook-form";

type InputFieldProps = {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    registration: UseFormRegisterReturn;
    error?: string;
    type?: string;
};

export default function InputField({
    label,
    placeholder,
    icon,
    registration,
    error,
    type = "text",
}: InputFieldProps) {
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
                <span className="text-base-content/50 shrink-0">{icon}</span>
                <input
                    type={type}
                    className="w-full"
                    placeholder={placeholder}
                    {...registration}
                />
            </div>
            {error && (
                <p className="mt-1 text-xs text-error">{error}</p>
            )}
        </label>
    );
}
