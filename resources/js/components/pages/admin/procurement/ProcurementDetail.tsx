import type { DetailResponse } from "./types";

export default function ProcurementDetail({ data }: { data: DetailResponse | null }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Kode Pengadaan
                    </p>
                    <p className="mt-1 font-mono text-sm font-semibold">{data.procurementCode}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Tanggal Pengadaan
                    </p>
                    <p className="mt-1 text-sm">{data.procurementDate}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Barang
                    </p>
                    <p className="mt-1 text-sm">{data.itemName}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Pemasok
                    </p>
                    <p className="mt-1 text-sm">{data.supplierName}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Jumlah
                    </p>
                    <p className="mt-1 text-sm">{data.quantity}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Harga Satuan
                    </p>
                    <p className="mt-1 text-sm">Rp {data.unitPrice.toLocaleString("id-ID")}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Total Harga
                    </p>
                    <p className="mt-1 text-lg font-bold text-primary">
                        Rp {data.totalPrice.toLocaleString("id-ID")}
                    </p>
                </div>
                {data.notes && (
                    <div className="col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            Catatan
                        </p>
                        <p className="mt-1 whitespace-pre-wrap text-sm">{data.notes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
