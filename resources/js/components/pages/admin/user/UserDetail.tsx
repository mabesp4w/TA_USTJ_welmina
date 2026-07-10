import type { DetailResponse } from "./types";

const roleLabels: Record<string, string> = {
    administrator: "Administrator",
    pengelola: "Pengelola",
    pimpinan: "Pimpinan",
};

export default function UserDetail({ data }: { data: DetailResponse | null }) {
    if (!data) return null;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Nama Lengkap
                    </p>
                    <p className="mt-1 text-sm font-medium">{data.fullName}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Username
                    </p>
                    <p className="mt-1 font-mono text-sm">{data.username}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Email
                    </p>
                    <p className="mt-1 text-sm">{data.email ?? "-"}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Role
                    </p>
                    <p className="mt-1 text-sm">{roleLabels[data.role] ?? data.role}</p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-base-content/50">
                        Status
                    </p>
                    <p className="mt-1 text-sm">
                        {data.isActive ? (
                            <span className="badge badge-success badge-sm">Aktif</span>
                        ) : (
                            <span className="badge badge-ghost badge-sm">Tidak Aktif</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
