import { Eye, Pencil, Trash2 } from "lucide-react";
import type { MemberItem } from "./types";

export default function MemberListCard({
    members,
    activeFilter,
    onFilterChange,
    onDetail,
    onEdit,
    onDelete,
}: {
    members: MemberItem[];
    activeFilter?: string | null;
    onFilterChange?: (filter: string | null) => void;
    onDetail?: (member: MemberItem) => void;
    onEdit?: (member: MemberItem) => void;
    onDelete?: (member: MemberItem) => void;
}) {
    const filters: { label: string; value: string | null }[] = [
        { label: "Semua", value: null },
        { label: "Aktif", value: "Aktif" },
        { label: "Nonaktif", value: "Nonaktif" },
    ];

    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="text-lg font-bold text-base-content">Daftar Member</h2>
                    <div className="join">
                        {filters.map((f) => (
                            <button
                                key={f.label}
                                className={`btn btn-sm join-item ${activeFilter === f.value ? "btn-active" : ""}`}
                                onClick={() => onFilterChange?.(f.value)}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {members.length === 0 ? (
                        <p className="py-8 text-center text-sm text-base-content/60">
                            Tidak ada data member
                        </p>
                    ) : (
                        members.map((member) => (
                            <div
                                key={member.id}
                                className="rounded-box border border-base-300 bg-base-200/40 p-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-bold text-base-content">
                                            {member.name}
                                        </p>
                                        <p className="mt-1 text-xs font-medium text-base-content/70">
                                            {member.plan}
                                        </p>
                                        <p className="mt-1 text-xs text-base-content/60">
                                            {member.period}
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <div className="text-right">
                                            <span
                                                className={`badge badge-sm ${member.status === "Aktif" ? "badge-success" : "badge-error"}`}
                                            >
                                                {member.status}
                                            </span>
                                            <p className="mt-2 text-xs text-base-content/60">
                                                {member.memberCode}
                                            </p>
                                        </div>

                                        <div className="flex gap-0.5">
                                            <button
                                                className="btn btn-ghost btn-xs btn-square"
                                                title="Detail"
                                                onClick={() => onDetail?.(member)}
                                            >
                                                <Eye size={14} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-xs btn-square"
                                                title="Edit"
                                                onClick={() => onEdit?.(member)}
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                className="btn btn-ghost btn-xs btn-square text-error"
                                                title="Hapus"
                                                onClick={() => onDelete?.(member)}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
