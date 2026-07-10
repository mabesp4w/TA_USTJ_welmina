import { Eye, Pencil, Trash2 } from "lucide-react";
import type { PaymentItem } from "./types";

export default function RegistrationPaymentListCard({
    payments,
    onDetail,
    onEdit,
    onDelete,
}: {
    payments: PaymentItem[];
    onDetail: (item: PaymentItem) => void;
    onEdit: (item: PaymentItem) => void;
    onDelete: (item: PaymentItem) => void;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <h2 className="text-lg font-bold text-base-content">Daftar Biaya Pendaftaran</h2>
                <div className="mt-4 overflow-x-auto">
                    <table className="table">
                    <thead>
                        <tr className="text-xs uppercase tracking-wide text-base-content/60">
                            <th>Member</th>
                            <th>Paket</th>
                            <th>Durasi</th>
                            <th>Periode</th>
                            <th>Biaya</th>
                            <th>Admin</th>
                            <th>Status</th>
                            <th className="w-24 text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-12 text-center text-sm text-base-content/50">
                                    Belum ada data biaya pendaftaran
                                </td>
                            </tr>
                        ) : (
                            payments.map((item) => (
                                <tr key={item.id} className="hover">
                                    <td>
                                        <div>
                                            <p className="text-sm font-medium">{item.memberName}</p>
                                            <p className="text-xs text-base-content/50">{item.memberCode}</p>
                                        </div>
                                    </td>
                                    <td className="text-sm">{item.packageName}</td>
                                    <td className="text-sm">{item.durationMonths} Bln</td>
                                    <td className="text-sm text-base-content/70">
                                        {item.startDate} - {item.endDate}
                                    </td>
                                    <td className="text-sm font-medium">
                                        Rp {item.registrationFee.toLocaleString("id-ID")}
                                    </td>
                                    <td className="text-sm">
                                        Rp {item.adminFee.toLocaleString("id-ID")}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge badge-sm ${
                                                item.paymentStatus === "paid"
                                                    ? "badge-success"
                                                    : "badge-warning"
                                            }`}
                                        >
                                            {item.paymentStatus === "paid" ? "Lunas" : "Belum Dibayar"}
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
