import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCheck, Search } from "lucide-react";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";
import AdminLayout from "./AdminLayout";
import { markAllRead } from "@/routes/admin/notification";

export default function NotificationLayout({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState("");
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const navigate = useCallback((overrides?: Record<string, string | undefined>) => {
        const params: Record<string, string | undefined> = {
            search: search || undefined,
            ...overrides,
        };

        router.get(
            window.location.pathname,
            params,
            { preserveScroll: true, preserveState: true, replace: true },
        );
    }, [search]);

    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => navigate(), 400);

        return () => clearTimeout(timerRef.current);
    }, [search, navigate]);

    const handleMarkAllRead = () => {
        router.post(markAllRead.url(), {}, {
            preserveScroll: true,
            onSuccess: () => toast.success("Semua notifikasi ditandai sudah dibaca!"),
            onError: () => toast.error("Gagal menandai notifikasi"),
        });
    };

    return (
        <AdminLayout
            actions={
                <>
                    <label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
                        <Search size={16} className="opacity-70" />
                        <input
                            type="text"
                            placeholder="Cari notifikasi..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

                    <button
                        className="btn btn-ghost gap-2"
                        onClick={handleMarkAllRead}
                    >
                        <CheckCheck size={18} />
                        Tandai Dibaca
                    </button>
                </>
            }
        >
            {children}
        </AdminLayout>
    );
}
