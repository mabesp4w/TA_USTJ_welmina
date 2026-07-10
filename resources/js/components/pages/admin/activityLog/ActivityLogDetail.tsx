import type { DetailResponse } from "./types";

const typeLabels: Record<string, string> = {
    tambah: "Tambah",
    servis: "Servis",
    pinjam: "Pinjam",
    kembali: "Kembali",
    rusak: "Rusak",
    pengadaan: "Pengadaan",
    pembayaran: "Pembayaran",
    pendaftaran: "Pendaftaran",
    lainnya: "Lainnya",
};

export default function ActivityLogDetail({ data }: { data: DetailResponse | null }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Waktu
                    </p>
                    <p className="mt-1 text-sm">{data.activityTime}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Aktivitas
                    </p>
                    <p className="mt-1 text-sm font-medium">{data.activityName}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Tipe
                    </p>
                    <p className="mt-1 text-sm">{typeLabels[data.activityType] ?? data.activityType}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Oleh
                    </p>
                    <p className="mt-1 text-sm">{data.userName}</p>
                </div>
                {data.description && (
                    <div className="col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            Deskripsi
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{data.description}</p>
                    </div>
                )}
                {data.referenceTable && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            Tabel Referensi
                        </p>
                        <p className="mt-1 text-sm">{data.referenceTable}</p>
                    </div>
                )}
                {data.referenceId && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            ID Referensi
                        </p>
                        <p className="mt-1 text-sm">{data.referenceId}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
