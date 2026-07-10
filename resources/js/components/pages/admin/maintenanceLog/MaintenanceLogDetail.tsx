import { Wrench, User } from "lucide-react";
import type { DetailResponse } from "./types";

const typeLabel: Record<string, string> = {
    perbaikan: "Perbaikan",
    perawatan: "Perawatan",
    pemeriksaan: "Pemeriksaan",
};

const conditionLabel: Record<string, string> = {
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

export default function MaintenanceLogDetail({ data }: { data: DetailResponse | null }) {
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
                <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Barang Inventaris
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm font-medium text-base-content">
                        <Wrench size={14} className="text-base-content/40" />
                        {data.itemName}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Jenis Perawatan
                    </p>
                    <span className={`badge badge-sm mt-1 ${data.maintenanceType === "perbaikan" ? "badge-error" : data.maintenanceType === "perawatan" ? "badge-warning" : "badge-info"}`}>
                        {typeLabel[data.maintenanceType]}
                    </span>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Tanggal Perawatan
                    </p>
                    <p className="mt-1 text-sm text-base-content/80">{data.maintenanceDate}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Biaya
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">
                        Rp {data.cost.toLocaleString("id-ID")}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Hasil Kondisi
                    </p>
                    <span className={`badge badge-sm mt-1 ${data.resultCondition === "baik" ? "badge-success" : data.resultCondition === "perlu_perawatan" ? "badge-warning" : "badge-error"}`}>
                        {conditionLabel[data.resultCondition]}
                    </span>
                </div>

                <div className="sm:col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Pelaksana
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-base-content/80">
                        <User size={14} />
                        {data.performedBy}
                    </p>
                </div>
            </div>

            {data.notes && (
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Catatan
                    </p>
                    <p className="mt-1 text-sm text-base-content/80">{data.notes}</p>
                </div>
            )}
        </div>
    );
}
