import { Eye, Edit, Trash2 } from "lucide-react";
import type { ProcurementItem } from "./types";

export default function ProcurementListCard({
    procurements,
    onDetail,
    onEdit,
    onDelete,
}: {
    procurements: ProcurementItem[];
    onDetail: (item: ProcurementItem) => void;
    onEdit: (item: ProcurementItem) => void;
    onDelete: (item: ProcurementItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-0">
                <div className="overflow-x-auto">
                    <table className="table table-zebra">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Barang</th>
                                <th>Pemasok</th>
                                <th className="text-right">Jumlah</th>
                                <th className="text-right">Harga Satuan</th>
                                <th className="text-right">Total</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {procurements.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="py-12 text-center text-base-content/50">
                                        Belum ada data pengadaan
                                    </td>
                                </tr>
                            ) : (
                                procurements.map((item) => (
                                    <tr key={item.id}>
                                        <td className="font-mono text-xs font-semibold">
                                            {item.procurementCode}
                                        </td>
                                        <td>{item.itemName}</td>
                                        <td>{item.supplierName}</td>
                                        <td className="text-right">{item.quantity}</td>
                                        <td className="text-right">
                                            Rp {item.unitPrice.toLocaleString("id-ID")}
                                        </td>
                                        <td className="text-right font-semibold">
                                            Rp {item.totalPrice.toLocaleString("id-ID")}
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
