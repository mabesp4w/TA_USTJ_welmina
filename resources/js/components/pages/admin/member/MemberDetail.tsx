import { CalendarDays, CreditCard, Mail, MapPin, Phone, User } from "lucide-react";

type MemberDetailData = {
    member: {
        id: number;
        memberCode: string;
        fullName: string;
        identityNo: string | null;
        phone: string | null;
        birthDate: string | null;
        gender: string | null;
        email: string | null;
        address: string | null;
        memberStatus: string;
        joinedAt: string;
        createdBy: string | null;
    };
    membership: {
        packageName: string;
        durationMonths: number;
        startDate: string;
        endDate: string;
        status: string;
    } | null;
};

export default function MemberDetail({ data }: { data: MemberDetailData | null }) {
    if (!data) return null;

    const { member, membership } = data;

    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {member.fullName.charAt(0)}
                </div>
                <div>
                    <p className="font-bold text-base-content">{member.fullName}</p>
                    <p className="text-sm text-base-content/60">
                        {member.memberCode}
                        <span
                            className={`badge badge-sm ml-2 ${member.memberStatus === "active" ? "badge-success" : "badge-error"}`}
                        >
                            {member.memberStatus === "active" ? "Aktif" : "Nonaktif"}
                        </span>
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                    <CreditCard size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">No. KTP</p>
                        <p className="text-sm font-medium">{member.identityNo || "-"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Phone size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">No. Telepon</p>
                        <p className="text-sm font-medium">{member.phone || "-"}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <CalendarDays size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Tanggal Lahir</p>
                        <p className="text-sm font-medium">
                            {member.birthDate || "-"} ({member.gender === "L" ? "Laki-laki" : member.gender === "P" ? "Perempuan" : "-"})
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Mail size={16} className="text-base-content/40" />
                    <div>
                        <p className="text-xs text-base-content/50">Email</p>
                        <p className="text-sm font-medium">{member.email || "-"}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-base-content/40" />
                <div>
                    <p className="text-xs text-base-content/50">Alamat</p>
                    <p className="text-sm font-medium">{member.address || "-"}</p>
                </div>
            </div>

            {membership && (
                <div className="rounded-box border border-base-300 bg-base-200/40 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-base-content/60">
                        Membership Saat Ini
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                            <p className="text-xs text-base-content/50">Paket</p>
                            <p className="font-medium">{membership.packageName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/50">Durasi</p>
                            <p className="font-medium">{membership.durationMonths} Bulan</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/50">Mulai</p>
                            <p className="font-medium">{membership.startDate}</p>
                        </div>
                        <div>
                            <p className="text-xs text-base-content/50">Berakhir</p>
                            <p className="font-medium">{membership.endDate}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex items-center gap-3 text-xs text-base-content/50">
                <User size={14} />
                <span>Dibuat oleh: {member.createdBy || "Sistem"}</span>
                <span>Bergabung: {member.joinedAt}</span>
            </div>
        </div>
    );
}
