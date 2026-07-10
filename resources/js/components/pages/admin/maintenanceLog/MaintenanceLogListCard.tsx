import { Eye, Pencil, Trash2, Wrench } from "lucide-react";
import type { MaintenanceLogItem } from "./types";

const typeLabel: Record<string, string> = {
    perbaikan: "Perbaikan",
    perawatan: "Perawatan",
    pemeriksaan: "Pemeriksaan",
};

const typeBadge: Record<string, string> = {
    perbaikan: "badge-error",
    perawatan: "badge-warning",
    pemeriksaan: "badge-info",
};

const conditionLabel: Record<string, string> = {
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

const conditionBadge: Record<string, string> = {
    baik: "badge-success",
    perlu_perawatan: "badge-warning",
    rusak: "badge-error",
};

export default function MaintenanceLogListCard({
    logs,
    onDetail,
    onEdit,
    onDelete,
}: {
    logs: MaintenanceLogItem[];
    onDetail: (item: MaintenanceLogItem) => void;
    onEdit: (item: MaintenanceLogItem) => void;
    onDelete: (item: MaintenanceLogItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Riwayat Perawatan</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-base-content/60">
                                <th>Barang</th>
                                <th>Jenis</th>
                                <th>Tanggal</th>
                                <th>Biaya</th>
                                <th>Hasil</th>
                                <th>Pelaksana</th>
                                <th className="w-24 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-sm text-base-content/50">
                                        Belum ada data perawatan
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover">
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Wrench size={14} className="text-base-content/40" />
                                                <span className="text-sm font-medium">{log.itemName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${typeBadge[log.maintenanceType]}`}>
                                                {typeLabel[log.maintenanceType]}
                                            </span>
                                        </td>
                                        <td className="text-sm">{log.maintenanceDate}</td>
                                        <td className="text-sm font-medium">
                                            Rp {log.cost.toLocaleString("id-ID")}
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${conditionBadge[log.resultCondition]}`}>
                                                {conditionLabel[log.resultCondition]}
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/70">{log.performedBy}</td>
                                        <td>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onDetail(log)}
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onEdit(log)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square text-error"
                                                    onClick={() => onDelete(log)}
                                                    title="Hapus"
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
