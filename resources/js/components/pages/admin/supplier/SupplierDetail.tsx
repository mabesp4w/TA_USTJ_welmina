import { Phone, Mail, MapPin } from "lucide-react";
import type { DetailResponse } from "./types";

export default function SupplierDetail({ data }: { data: DetailResponse | null }) {
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
                        Nama Pemasok
                    </p>
                    <p className="mt-1 text-sm font-medium text-base-content">{data.supplierName}</p>
                </div>

                {data.phone && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Telepon
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm text-base-content/80">
                            <Phone size={14} />
                            {data.phone}
                        </p>
                    </div>
                )}

                {data.email && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Email
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-sm text-base-content/80">
                            <Mail size={14} />
                            {data.email}
                        </p>
                    </div>
                )}

                {data.address && (
                    <div className="sm:col-span-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                            Alamat
                        </p>
                        <p className="mt-1 flex items-start gap-1 text-sm text-base-content/80">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            {data.address}
                        </p>
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
