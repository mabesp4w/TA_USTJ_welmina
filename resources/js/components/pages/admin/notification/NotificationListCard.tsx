import { Eye, Trash2 } from "lucide-react";
import type { NotificationItem } from "./types";

const typeIcons: Record<string, string> = {
    info: "ℹ️",
    warning: "⚠️",
    danger: "🔴",
    success: "✅",
};

const typeColors: Record<string, string> = {
    info: "badge-info",
    warning: "badge-warning",
    danger: "badge-error",
    success: "badge-success",
};

export default function NotificationListCard({
    notifications,
    onDetail,
    onDelete,
}: {
    notifications: NotificationItem[];
    onDetail: (item: NotificationItem) => void;
    onDelete: (item: NotificationItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-0">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Judul</th>
                                <th>Tipe</th>
                                <th>Waktu</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-base-content/50">
                                        Belum ada notifikasi
                                    </td>
                                </tr>
                            ) : (
                                notifications.map((item) => (
                                    <tr key={item.id} className={!item.isRead ? "font-semibold" : ""}>
                                        <td>
                                            <div
                                                className={`h-2 w-2 rounded-full ${item.isRead ? "bg-base-300" : "bg-primary"}`}
                                                title={item.isRead ? "Sudah dibaca" : "Belum dibaca"}
                                            />
                                        </td>
                                        <td className="max-w-xs">
                                            <p className="truncate">{item.title}</p>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${typeColors[item.notificationType] ?? "badge-ghost"}`}>
                                                {item.notificationType}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap font-mono text-xs">
                                            {item.createdAt}
                                        </td>
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
