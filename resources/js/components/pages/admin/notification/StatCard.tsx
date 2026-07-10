export default function StatCard({
    title,
    value,
    subtitle,
}: {
    title: string;
    value: string;
    subtitle: string;
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4 md:p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
                    {title}
                </p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
                <p className="mt-0.5 text-xs text-base-content/50">{subtitle}</p>
            </div>
        </div>
    );
}
