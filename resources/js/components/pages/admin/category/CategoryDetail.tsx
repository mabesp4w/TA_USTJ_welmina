import { Dumbbell } from "lucide-react";
import type { DetailResponse } from "./types";

export default function CategoryDetail({ data }: { data: DetailResponse | null }) {
    if (!data) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-base-content/60">Tidak ada data</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Nama Kategori
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.categoryName}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Alat Fitness
                    </p>
                    <p className="mt-1">
                        {data.isFitnessTools ? (
                            <span className="badge badge-info gap-1">
                                <Dumbbell size={10} />
                                Ya
                            </span>
                        ) : (
                            <span className="badge badge-ghost">Tidak</span>
                        )}
                    </p>
                </div>
            </div>

            {data.description && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Deskripsi
                    </p>
                    <p className="mt-1 text-sm text-base-content/80">{data.description}</p>
                </div>
            )}
        </div>
    );
}
