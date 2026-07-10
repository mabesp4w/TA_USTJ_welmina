import { Eye, Pencil, Trash2, MapPin, Building2 } from "lucide-react";
import type { InventoryItem } from "./types";

const conditionBadge: Record<string, string> = {
    baik: "badge-success",
    perlu_perawatan: "badge-warning",
    rusak: "badge-error",
};

const conditionLabel: Record<string, string> = {
    baik: "Baik",
    perlu_perawatan: "Perlu Perawatan",
    rusak: "Rusak",
};

const statusBadge: Record<string, string> = {
    aktif: "badge-success",
    tidak_aktif: "badge-error",
};

const statusLabel: Record<string, string> = {
    aktif: "Aktif",
    tidak_aktif: "Tidak Aktif",
};

export default function InventoryListCard({
    items,
    onDetail,
    onEdit,
    onDelete,
}: {
    items: InventoryItem[];
    onDetail: (item: InventoryItem) => void;
    onEdit: (item: InventoryItem) => void;
    onDelete: (item: InventoryItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Daftar Inventaris</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr className="text-xs uppercase tracking-wide text-base-content/60">
                                <th>Barang</th>
                                <th>Kategori</th>
                                <th>Stok</th>
                                <th>Kondisi</th>
                                <th>Status</th>
                                <th>Lokasi</th>
                                <th>Supplier</th>
                                <th className="w-24 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-sm text-base-content/50">
                                        Belum ada data inventaris
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover">
                                        <td>
                                            <div>
                                                <p className="text-sm font-medium">{item.itemName}</p>
                                                <p className="text-xs text-base-content/50">{item.itemCode}</p>
                                            </div>
                                        </td>
                                        <td className="text-sm">{item.categoryName}</td>
                                        <td className="text-sm font-medium">{item.stock}</td>
                                        <td>
                                            <span className={`badge badge-sm ${conditionBadge[item.itemCondition]}`}>
                                                {conditionLabel[item.itemCondition]}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`badge badge-sm ${statusBadge[item.itemStatus]}`}>
                                                {statusLabel[item.itemStatus]}
                                            </span>
                                        </td>
                                        <td className="text-sm text-base-content/70">
                                            {item.locationName ? (
                                                <span className="flex items-center gap-1">
                                                    <MapPin size={12} />
                                                    {item.locationName}
                                                </span>
                                            ) : "-"}
                                        </td>
                                        <td className="text-sm text-base-content/70">
                                            {item.supplierName ? (
                                                <span className="flex items-center gap-1">
                                                    <Building2 size={12} />
                                                    {item.supplierName}
                                                </span>
                                            ) : "-"}
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
