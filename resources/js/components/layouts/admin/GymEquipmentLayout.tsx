import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { router } from "@inertiajs/react";
import AdminLayout from "./AdminLayout";

export default function GymEquipmentLayout({ children }: { children: React.ReactNode }) {
    const [search, setSearch] = useState(() =>
        new URLSearchParams(window.location.search).get("search") ?? "",
    );
    const timerRef = useRef<ReturnType<typeof setTimeout>>();

    const navigate = useCallback(() => {
        const params = new URLSearchParams(window.location.search);
        if (search) {
            params.set("search", search);
        } else {
            params.delete("search");
        }
        params.delete("page");

        router.get(
            window.location.pathname,
            Object.fromEntries(params),
            { preserveScroll: true, preserveState: true, replace: true },
        );
    }, [search]);

    useEffect(() => {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => navigate(), 400);

        return () => clearTimeout(timerRef.current);
    }, [search, navigate]);

    return (
        <AdminLayout
            title="Peralatan Fitness"
            actions={
                <>
                    <label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
                        <Search size={16} className="opacity-70" />
                        <input
                            type="text"
                            placeholder="Cari peralatan..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

                    <button
                        className="btn btn-primary gap-2"
                        onClick={() => document.getElementById("inventory-modal")?.showModal()}
                    >
                        <Plus size={18} />
                        Tambah Peralatan
                    </button>
                </>
            }
        >
            {children}
        </AdminLayout>
    );
}
