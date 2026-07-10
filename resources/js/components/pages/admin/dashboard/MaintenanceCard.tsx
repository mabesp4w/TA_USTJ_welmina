import type { ListItem } from './types';

export default function MaintenanceCard({
    title,
    items,
}: {
    title: string;
    items: ListItem[];
}) {
    return (
        <div className="card border border-base-300 bg-base-100/70 backdrop-blur-sm shadow-sm">
            <div className="card-body p-4">
                <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-base-content/70">
                    {title}
                </h2>

                <div className="space-y-3">
                    {items.map((item) => (
                        <div
                            key={`${title}-${item.name}`}
                            className="flex items-center justify-between gap-3 rounded-box border border-base-200 px-3 py-2"
                        >
                            <div className="flex min-w-0 items-start gap-3">
                                <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-warning" />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-base-content">{item.name}</p>
                                    {item.meta ? (
                                        <p className="mt-0.5 text-xs text-base-content/60">{item.meta}</p>
                                    ) : null}
                                </div>
                            </div>

                            <span className="badge badge-ghost badge-sm whitespace-nowrap">
                                Status
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
