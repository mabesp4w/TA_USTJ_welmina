import type { Stat } from "./types";

export default function StatCard({ title, value, subtitle }: Stat) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body gap-2 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                    {title}
                </p>
                <div className="text-3xl font-bold leading-none text-base-content">{value}</div>
                <p className="text-xs text-base-content/60">{subtitle}</p>
            </div>
        </div>
    );
}
