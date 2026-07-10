import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

type ModalProps = {
    id: string;
    title: string;
    children: React.ReactNode;
    size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
    open?: boolean;
    onClose?: () => void;
};

const sizeClass: Record<string, string> = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
};

export default function Modal({ id, title, children, size = "md", open, onClose }: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null);

    const close = useCallback(() => {
        ref.current?.close();
        onClose?.();
    }, [onClose]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (open) {
            el.showModal();
        } else {
            el.close();
        }
    }, [open]);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener("close", onClose ?? (() => {}));
        return () => el.removeEventListener("close", onClose ?? (() => {}));
    }, [onClose]);

    return (
        <dialog id={id} ref={ref} className="modal">
            <div className={`modal-box ${sizeClass[size]}`}>
                <button
                    type="button"
                    onClick={close}
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                >
                    <X size={18} />
                </button>
                <h3 className="text-lg font-bold mb-4">{title}</h3>
                {children}
            </div>
            <button type="button" className="modal-backdrop" onClick={close}>
                close
            </button>
        </dialog>
    );
}
