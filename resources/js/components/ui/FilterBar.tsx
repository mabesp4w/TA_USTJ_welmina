import { router, usePage } from "@inertiajs/react";
import { SlidersHorizontal, X } from "lucide-react";
import Select from "react-select";
import { reactSelectStyles } from "./selectStyles";

export type FilterSelect = {
    name: string;
    label: string;
    options: { value: string; label: string }[];
    placeholder?: string;
    /** Column span (1-8) on md+ screens. Defaults to 2. */
    col?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
};

// Static classes so Tailwind can detect them at build time.
const colSpan: Record<number, string> = {
    1: "md:col-span-1",
    2: "md:col-span-2",
    3: "md:col-span-3",
    4: "md:col-span-4",
    5: "md:col-span-5",
    6: "md:col-span-6",
    7: "md:col-span-7",
    8: "md:col-span-8",
};

export default function FilterBar({ filters }: { filters: FilterSelect[] }) {
    const { url } = usePage();
    const params = new URLSearchParams(url.split("?")[1] ?? "");
    const current = (name: string) => params.get(name) ?? "";
    const hasActive = filters.some((f) => current(f.name) !== "");

    const navigate = (next: URLSearchParams) => {
        next.delete("page");
        router.get(window.location.pathname, Object.fromEntries(next), {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleChange = (name: string, value: string) => {
        const next = new URLSearchParams(window.location.search);
        if (value) {
            next.set(name, value);
        } else {
            next.delete(name);
        }
        navigate(next);
    };

    const reset = () => {
        const next = new URLSearchParams(window.location.search);
        filters.forEach((f) => next.delete(f.name));
        navigate(next);
    };

    return (
        <div className="card border border-base-300 bg-base-100/70 shadow-sm backdrop-blur-sm">
            <div className="card-body gap-4 p-4 md:p-5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-base-content/70">
                        <SlidersHorizontal size={16} />
                        <span className="text-sm font-semibold">Filter</span>
                    </div>

                    {hasActive && (
                        <button
                            type="button"
                            className="btn btn-ghost btn-sm gap-2"
                            onClick={reset}
                        >
                            <X size={16} />
                            Reset
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-8">
                    {filters.map((filter) => (
                        <div key={filter.name} className={`form-control w-full ${colSpan[filter.col ?? 2]}`}>
                            <div className="label pb-1">
                                <span className="label-text text-xs font-semibold uppercase tracking-wide text-base-content/60">
                                    {filter.label}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg border border-base-300 px-3 py-1.5">
                                <Select
                                    className="w-full"
                                    classNamePrefix="react-select"
                                    placeholder={filter.placeholder ?? "Semua"}
                                    options={filter.options}
                                    isClearable
                                    value={filter.options.find((o) => o.value === current(filter.name)) ?? null}
                                    onChange={(option) => handleChange(filter.name, option?.value ?? "")}
                                    menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
                                    styles={reactSelectStyles}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
