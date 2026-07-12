import { router } from "@inertiajs/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationLink } from "@/types";

export default function Pagination({
    links,
    from,
    to,
    total,
}: {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
}) {
    if (total <= 0 || links.length <= 3) return null;

    const pageLinks = links.slice(1, -1);
    const prev = links[0];
    const next = links[links.length - 1];

    return (
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <p className="text-xs text-base-content/60">
                Menampilkan {from}–{to} dari {total} data
            </p>
            <div className="join">
                <button
                    className="btn btn-sm join-item"
                    disabled={!prev?.url}
                    onClick={() => prev?.url && router.get(prev.url, {}, { preserveState: true, preserveScroll: true })}
                >
                    <ChevronLeft size={14} />
                </button>
                {pageLinks.map((link) => (
                    <button
                        key={link.label}
                        className={`btn btn-sm join-item ${link.active ? "btn-secondary" : ""}`}
                        disabled={!link.url}
                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true, preserveScroll: true })}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
                <button
                    className="btn btn-sm join-item"
                    disabled={!next?.url}
                    onClick={() => next?.url && router.get(next.url, {}, { preserveState: true, preserveScroll: true })}
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}
