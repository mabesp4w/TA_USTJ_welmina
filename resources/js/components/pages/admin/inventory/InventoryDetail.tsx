import { MapPin, Building2, ImageOff } from "lucide-react";
import type { DetailResponse } from "./types";

const conditionLabel: Record<string, string> = {
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

const statusLabel: Record<string, string> = {
    aktif: "Aktif",
    tidak_aktif: "Tidak Aktif",
};

export default function InventoryDetail({ data }: { data: DetailResponse | null }) {
    if (!data) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-sm text-base-content/60">Tidak ada data</p>
            </div>
        );
    }

    return (
        <div className="space-y-5">
            {data.imagePath ? (
                <img
                    src={data.imagePath}
                    alt={data.itemName}
                    className="h-48 w-full rounded-lg object-cover"
                />
            ) : (
                <div className="flex h-48 items-center justify-center rounded-lg bg-base-300/30">
                    <ImageOff size={40} className="text-base-content/30" />
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Nama Barang
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.itemName}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Kode Barang
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.itemCode}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Kategori
                    </p>
                    <p className="mt-1 text-sm text-base-content/80">{data.categoryName}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Stok
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.stock}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Kondisi
                    </p>
                    <span className={`badge badge-sm mt-1 ${data.itemCondition === "baik" ? "badge-success" : data.itemCondition === "perlu_perawatan" ? "badge-warning" : "badge-error"}`}>
                        {conditionLabel[data.itemCondition]}
                    </span>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Status
                    </p>
                    <span className={`badge badge-sm mt-1 ${data.itemStatus === "aktif" ? "badge-success" : "badge-error"}`}>
                        {statusLabel[data.itemStatus]}
                    </span>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Lokasi
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-base-content/80">
                        <MapPin size={14} />
                        {data.locationName ?? "-"}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Supplier
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-base-content/80">
                        <Building2 size={14} />
                        {data.supplierName ?? "-"}
                    </p>
                </div>

                {data.lastServiceDate && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Tgl. Service Terakhir
                        </p>
                        <p className="mt-1 text-sm text-base-content/80">{data.lastServiceDate}</p>
                    </div>
                )}
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
