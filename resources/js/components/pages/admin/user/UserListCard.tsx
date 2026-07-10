import { Eye, Edit, Trash2 } from "lucide-react";
import type { UserItem } from "./types";

const roleLabels: Record<string, string> = {
    administrator: "Administrator",
    pengelola: "Pengelola",
    pimpinan: "Pimpinan",
};

export default function UserListCard({
    users,
    onDetail,
    onEdit,
    onDelete,
}: {
    users: UserItem[];
    onDetail: (item: UserItem) => void;
    onEdit: (item: UserItem) => void;
    onDelete: (item: UserItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-0">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Nama</th>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-base-content/50">
                                        Belum ada pengguna
                                    </td>
                                </tr>
                            ) : (
                                users.map((item) => (
                                    <tr key={item.id}>
                                        <td className="font-medium">{item.fullName}</td>
                                        <td className="font-mono text-sm">{item.username}</td>
                                        <td className="text-sm text-base-content/70">{item.email ?? "-"}</td>
                                        <td>
                                            <span className="badge badge-sm">
                                                {roleLabels[item.role] ?? item.role}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {item.isActive ? (
                                                <span className="badge badge-success badge-sm">Aktif</span>
                                            ) : (
                                                <span className="badge badge-ghost badge-sm">Tidak Aktif</span>
                                            )}
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
                                                    className="btn btn-ghost btn-square btn-sm"
                                                    title="Edit"
                                                    onClick={() => onEdit(item)}
                                                >
                                                    <Edit size={16} />
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
