import { Eye, Pencil, Trash2, Phone, Mail, MapPin } from "lucide-react";
import type { SupplierItem } from "./types";

export default function SupplierListCard({
    suppliers,
    onDetail,
    onEdit,
    onDelete,
}: {
    suppliers: SupplierItem[];
    onDetail: (item: SupplierItem) => void;
    onEdit: (item: SupplierItem) => void;
    onDelete: (item: SupplierItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Daftar Pemasok</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-base-content/60">
                                <th>Pemasok</th>
                                <th>Kontak</th>
                                <th>Alamat</th>
                                <th>Barang</th>
                                <th className="w-24 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-sm text-base-content/50">
                                        Belum ada data pemasok
                                    </td>
                                </tr>
                            ) : (
                                suppliers.map((item) => (
                                    <tr key={item.id} className="hover">
                                        <td>
                                            <p className="text-sm font-medium">{item.supplierName}</p>
                                        </td>
                                        <td>
                                            <div className="space-y-1 text-sm">
                                                {item.phone && (
                                                    <p className="flex items-center gap-1 text-base-content/70">
                                                        <Phone size={12} />
                                                        {item.phone}
                                                    </p>
                                                )}
                                                {item.email && (
                                                    <p className="flex items-center gap-1 text-base-content/70">
                                                        <Mail size={12} />
                                                        {item.email}
                                                    </p>
                                                )}
                                                {!item.phone && !item.email && (
                                                    <span className="text-base-content/50">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-sm text-base-content/70 max-w-48">
                                            {item.address ? (
                                                <span className="flex items-start gap-1">
                                                    <MapPin size={12} className="mt-0.5 shrink-0" />
                                                    <span className="truncate">{item.address}</span>
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td className="text-sm">{item.itemCount} barang</td>
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
