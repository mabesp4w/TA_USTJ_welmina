import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { router } from "@inertiajs/react";
import PengelolaLayout from "./PengelolaLayout";

export default function PengelolaGymEquipmentLayout({ children }: { children: React.ReactNode }) {
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

    return (
        <PengelolaLayout
            actions={
                <>
                    <label className="input input-bordered flex w-full items-center gap-2 sm:w-72">
                        <Search size={16} className="opacity-70" />
                        <input
                            type="text"
                            placeholder="Cari kategori..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </label>

                    <button
                        className="btn btn-primary gap-2"
                        onClick={() => document.getElementById("category-modal")?.showModal()}
                    >
                        <Plus size={18} />
                        Tambah Kategori
                    </button>
                </>
            }
        >
            {children}
        </PengelolaLayout>
    );
}
