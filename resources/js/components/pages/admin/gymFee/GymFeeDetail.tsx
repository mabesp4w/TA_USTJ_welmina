import type { DetailResponse } from "./types";

export default function GymFeeDetail({ data }: { data: DetailResponse | null }) {
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
                        Nama Paket
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.packageName}</p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Biaya Pendaftaran
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">
                        Rp {data.registrationFee.toLocaleString("id-ID")}
                    </p>
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                        Status
                    </p>
                    <span
                        className={`badge badge-sm mt-1 ${
                            data.isActive ? "badge-success" : "badge-error"
                        }`}
                    >
                        {data.isActive ? "Aktif" : "Nonaktif"}
                    </span>
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

            <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                    Harga per Durasi
                </p>
                <div className="mt-2 space-y-2">
                    {data.prices.length === 0 ? (
                        <p className="text-sm text-base-content/60">Belum ada harga</p>
                    ) : (
                        data.prices.map((price, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-base-300 bg-base-200/40 px-4 py-3"
                            >
                                <span className="text-sm font-medium text-base-content">
                                    {price.durationMonths} Bulan
                                </span>
                                <span className="text-sm font-bold text-base-content">
                                    Rp {price.price.toLocaleString("id-ID")}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
