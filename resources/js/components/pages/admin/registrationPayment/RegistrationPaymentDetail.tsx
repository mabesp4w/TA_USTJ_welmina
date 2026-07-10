import { CalendarDays, CreditCard, User, Package, Calculator, Wallet, FileText, Timer } from "lucide-react";
import type { DetailResponse } from "./types";

export default function RegistrationPaymentDetail({ data }: { data: DetailResponse | null }) {
    if (!data) return null;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {data.memberName.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-base-content">{data.memberName}</p>
                    <p className="text-sm text-base-content/60">
                        {data.memberCode}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                    <Package size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Paket</p>
                        <p className="text-sm font-medium">{data.packageName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Timer size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Durasi</p>
                        <p className="text-sm font-medium">{data.durationMonths} Bulan</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Tanggal Mulai</p>
                        <p className="text-sm font-medium">{data.startDate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Tanggal Berakhir</p>
                        <p className="text-sm font-medium">{data.endDate}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calculator size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Biaya Pendaftaran</p>
                        <p className="text-sm font-medium">
                            Rp {data.registrationFee.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calculator size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Biaya Membership</p>
                        <p className="text-sm font-medium">
                            Rp {data.amount.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Calculator size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Biaya Admin</p>
                        <p className="text-sm font-medium">
                            Rp {data.adminFee.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Wallet size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Metode Pembayaran</p>
                        <p className="text-sm font-medium capitalize">{data.paymentMethod}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Status Pembayaran</p>
                        <p className="text-sm font-medium">
                            <span
                                className={`badge badge-sm ${
                                    data.paymentStatus === "paid" ? "badge-success" : "badge-warning"
                                }`}
                            >
                                {data.paymentStatus === "paid" ? "Lunas" : "Belum Dibayar"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {data.notes && (
                <div className="flex items-start gap-3">
                    <FileText size={16} className="mt-0.5 shrink-0 text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Catatan</p>
                        <p className="text-sm font-medium">{data.notes}</p>
                    </div>
                </div>
            )}

            <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
                <div className="flex items-center justify-between">
                    <span className="text-sm text-base-content/60">Total Biaya</span>
                    <span className="text-lg font-bold text-primary">
                        Rp {data.totalFee.toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-base-content/50">
                <User size={14} />
                <span>Dibuat oleh: {data.createdBy}</span>
                <span>{data.createdAt}</span>
            </div>
        </div>
    );
}
