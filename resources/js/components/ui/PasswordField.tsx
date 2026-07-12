import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { type UseFormRegisterReturn } from "react-hook-form";

type PasswordFieldProps = {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    registration: UseFormRegisterReturn;
    error?: string;
};

export default function PasswordField({
    label,
    placeholder,
    icon,
    registration,
    error,
}: PasswordFieldProps) {
    const [show, setShow] = useState(false);

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
                    type={show ? "text" : "password"}
                    className="w-full"
                    placeholder={placeholder}
                    {...registration}
                />
                <button
                    type="button"
                    className="btn btn-ghost btn-xs shrink-0"
                    onClick={() => setShow(!show)}
                    tabIndex={-1}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
            {error && (
                <p className="mt-1 text-xs text-error">{error}</p>
            )}
        </label>
    );
}
