import type { DetailResponse } from "./types";

const typeLabels: Record<string, string> = {
    info: "Informasi",
    warning: "Peringatan",
    danger: "Bahaya",
    success: "Berhasil",
};

export default function NotificationDetail({ data }: { data: DetailResponse | null }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Judul
                    </p>
                    <p className="mt-1 text-sm font-medium">{data.title}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Tipe
                    </p>
                    <p className="mt-1 text-sm">{typeLabels[data.notificationType] ?? data.notificationType}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Waktu
                    </p>
                    <p className="mt-1 text-sm">{data.createdAt}</p>
                </div>
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Pesan
                    </p>
                    <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-base-content/80">
                        {data.message}
                    </p>
                </div>
                {data.creatorName && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            Dibuat Oleh
                        </p>
                        <p className="mt-1 text-sm">{data.creatorName}</p>
                    </div>
                )}
                {data.relatedTable && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                            Referensi
                        </p>
                        <p className="mt-1 text-sm">
                            {data.relatedTable} #{data.relatedId}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
