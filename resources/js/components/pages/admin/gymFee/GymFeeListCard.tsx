import { Eye, Pencil, Trash2 } from "lucide-react";
import type { PackageItem } from "./types";

export default function GymFeeListCard({
    packages,
    onDetail,
    onEdit,
    onDelete,
}: {
    packages: PackageItem[];
    onDetail: (item: PackageItem) => void;
    onEdit: (item: PackageItem) => void;
    onDelete: (item: PackageItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Daftar Paket Gym</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-base-content/60">
                                <th>Paket</th>
                                <th>Biaya Pendaftaran</th>
                                <th>Harga</th>
                                <th>Durasi</th>
                                <th>Status</th>
                                <th className="w-24 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {packages.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-sm text-base-content/50">
                                        Belum ada data paket gym
                                    </td>
                                </tr>
                            ) : (
                                packages.map((item) => (
                                    <tr key={item.id} className="hover">
                                        <td>
                                            <div>
                                                <p className="text-sm font-medium">{item.packageName}</p>
                                                {item.description && (
                                                    <p className="text-xs text-base-content/50 truncate max-w-48">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-sm font-medium">
                                            Rp {item.registrationFee.toLocaleString("id-ID")}
                                        </td>
                                        <td className="text-sm">
                                            Rp {item.minPrice.toLocaleString("id-ID")}
                                            {item.maxPrice > item.minPrice
                                                ? ` - Rp ${item.maxPrice.toLocaleString("id-ID")}`
                                                : ""}
                                        </td>
                                        <td className="text-sm">{item.priceCount} durasi</td>
                                        <td>
                                            <span
                                                className={`badge badge-sm ${
                                                    item.isActive ? "badge-success" : "badge-error"
                                                }`}
                                            >
                                                {item.isActive ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex items-center justify-center gap-1">
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onDetail(item)}
                                                    title="Detail"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square"
                                                    onClick={() => onEdit(item)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-ghost btn-xs btn-square text-error"
                                                    onClick={() => onDelete(item)}
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
