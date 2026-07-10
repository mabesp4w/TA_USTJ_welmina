import { ImageOff } from "lucide-react";
import type { DetailResponse } from "./types";

export default function GymEquipmentDetail({ data }: { data: DetailResponse | null }) {
    if (!data) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-base-content/60">Tidak ada data</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {data.image ? (
                <img
                    src={data.image}
                    alt={data.categoryName}
                    className="h-56 w-full rounded-lg object-cover"
                />
            ) : (
                <div className="flex h-56 items-center justify-center rounded-lg bg-base-300/30">
                    <ImageOff size={48} className="text-base-content/30" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Nama Kategori
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.categoryName}</p>
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
