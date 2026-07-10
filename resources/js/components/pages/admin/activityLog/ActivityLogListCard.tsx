import { Eye, Trash2 } from "lucide-react";
import type { ActivityLogItem } from "./types";

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

const typeColors: Record<string, string> = {
    tambah: "badge-success",
    servis: "badge-warning",
    pinjam: "badge-info",
    kembali: "badge-info",
    rusak: "badge-error",
    pengadaan: "badge-primary",
    pembayaran: "badge-accent",
    pendaftaran: "badge-secondary",
    lainnya: "badge-ghost",
};

export default function ActivityLogListCard({
    logs,
    onDetail,
    onDelete,
}: {
    logs: ActivityLogItem[];
    onDetail: (item: ActivityLogItem) => void;
    onDelete: (item: ActivityLogItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-0">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Waktu</th>
                                <th>Aktivitas</th>
                                <th>Tipe</th>
                                <th>Deskripsi</th>
                                <th>Oleh</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-base-content/50">
                                        Belum ada aktivitas
                                    </td>
                                </tr>
                            ) : (
                                logs.map((item) => (
                                    <tr key={item.id}>
                                        <td className="whitespace-nowrap font-mono text-xs">
                                            {item.activityTime}
                                        </td>
                                        <td className="font-medium">{item.activityName}</td>
                                        <td>
                                            <span className={`badge badge-sm ${typeColors[item.activityType] ?? "badge-ghost"}`}>
                                                {typeLabels[item.activityType] ?? item.activityType}
                                            </span>
                                        </td>
                                        <td className="max-w-xs truncate text-sm text-base-content/70">
                                            {item.description ?? "-"}
                                        </td>
                                        <td className="text-sm">{item.userName}</td>
                                        <td>
                                            <div className="flex justify-center gap-1">
                                                <button
                                                    className="btn btn-ghost btn-square btn-sm"
                                                    title="Detail"
                                                    onClick={() => onDetail(item)}
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    className="btn btn-ghost btn-square btn-sm text-error"
                                                    title="Hapus"
                                                    onClick={() => onDelete(item)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
